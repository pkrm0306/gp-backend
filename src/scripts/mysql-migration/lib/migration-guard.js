"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertMigrationTargetSafe = assertMigrationTargetSafe;
function assertMigrationTargetSafe(config) {
    if (!config.migrationMongoUri) {
        throw new Error('MIGRATION_MONGO_URI is required. Use a separate MongoDB database for migration testing — never your live app DB.');
    }
    if (!config.appMongoUri) {
        return;
    }
    var normalize = function (uri) { return uri.replace(/\/+$/, ''); };
    var sameUri = normalize(config.migrationMongoUri) === normalize(config.appMongoUri);
    if (sameUri && !config.allowLiveTarget) {
        throw new Error('MIGRATION_MONGO_URI matches MONGODB_URI (live app database). ' +
            'Set ALLOW_LIVE_TARGET=true only if you intentionally target production.');
    }
}
