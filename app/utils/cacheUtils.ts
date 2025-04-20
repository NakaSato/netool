/**
 * Simple cache implementation for CIDR/network calculations
 */

// Define interface for cache entries
interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

// Type for the cache object
type CacheStore = {
  [key: string]: CacheEntry<unknown>;
};

// Maximum cache size to prevent memory issues
const MAX_CACHE_SIZE = 100;

// Cache expiration time (30 minutes in milliseconds)
const CACHE_EXPIRATION = 30 * 60 * 1000;

// Create the cache store
let cacheStore: CacheStore = {};

/**
 * Set a value in the cache
 */
export const setCacheValue = <T>(key: string, value: T): void => {
  // Clean expired entries if cache size exceeds limit
  if (Object.keys(cacheStore).length >= MAX_CACHE_SIZE) {
    cleanCache();
  }

  // Store the value with a timestamp
  cacheStore[key] = {
    value,
    timestamp: Date.now(),
  };
};

/**
 * Get a value from the cache
 * Returns null if the value is not found or expired
 */
export const getCacheValue = <T>(key: string): T | null => {
  const entry = cacheStore[key] as CacheEntry<T> | undefined;

  // Return null if entry doesn't exist
  if (!entry) return null;

  // Check if the entry is expired
  if (Date.now() - entry.timestamp > CACHE_EXPIRATION) {
    // Remove expired entry
    delete cacheStore[key];
    return null;
  }

  return entry.value;
};

/**
 * Generate a cache key from IP and CIDR
 */
export const generateCacheKey = (ip: number[], cidr: number): string => {
  return `${ip.join(".")}_${cidr}`;
};

/**
 * Remove old entries to keep cache size in check
 */
const cleanCache = (): void => {
  const now = Date.now();
  const entries = Object.entries(cacheStore);

  // First remove expired entries
  const freshEntries = entries.filter(
    ([_, entry]) => now - entry.timestamp <= CACHE_EXPIRATION
  );

  // If we still have too many entries, keep only the most recent ones
  if (freshEntries.length >= MAX_CACHE_SIZE) {
    freshEntries.sort((a, b) => b[1].timestamp - a[1].timestamp);
    const entriesToKeep = freshEntries.slice(0, MAX_CACHE_SIZE - 10);

    // Rebuild cache with only the entries to keep
    const newCache: CacheStore = {};
    entriesToKeep.forEach(([key, value]) => {
      newCache[key] = value;
    });

    cacheStore = newCache;
  } else {
    // Just rebuild from the fresh entries
    cacheStore = Object.fromEntries(freshEntries);
  }
};

/**
 * Clear the entire cache
 */
export const clearCache = (): void => {
  cacheStore = {};
};

/**
 * Get statistics about the cache
 */
export const getCacheStats = (): { size: number; oldest: number } => {
  const entries = Object.values(cacheStore);
  if (entries.length === 0) {
    return { size: 0, oldest: 0 };
  }

  const oldest = Math.min(...entries.map((entry) => entry.timestamp));
  return {
    size: entries.length,
    oldest: Date.now() - oldest,
  };
};
