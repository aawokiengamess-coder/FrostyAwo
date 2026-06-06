/**
 * Cooldown Helper Utilities
 * 
 * Provides functions to check if a user can bypass cooldowns based on their roles.
 */

const COMMUNITY_MANAGER_ROLE_ID = '1506400817417294074';

/**
 * Check if a user can bypass cooldowns based on their roles
 * @param {Object} member - Discord GuildMember object
 * @returns {boolean} - True if user can bypass cooldowns
 */
export function canBypassCooldown(member) {
    if (!member) return false;
    
    // Check if user has the Community Manager+ role
    if (member.roles.cache.has(COMMUNITY_MANAGER_ROLE_ID)) {
        return true;
    }
    
    // Also allow server owners to bypass
    if (member.guild && member.id === member.guild.ownerId) {
        return true;
    }
    
    return false;
}

/**
 * Get remaining cooldown time, or 0 if user can bypass
 * @param {Object} member - Discord GuildMember object
 * @param {number} lastUsed - Timestamp of last use
 * @param {number} cooldownMs - Cooldown duration in milliseconds
 * @returns {number} - Remaining cooldown in milliseconds (0 if can bypass)
 */
export function getRemainingCooldown(member, lastUsed, cooldownMs) {
    if (canBypassCooldown(member)) {
        return 0;
    }
    
    const now = Date.now();
    const remaining = (lastUsed + cooldownMs) - now;
    return Math.max(0, remaining);
}

export default {
    canBypassCooldown,
    getRemainingCooldown,
    COMMUNITY_MANAGER_ROLE_ID
};
