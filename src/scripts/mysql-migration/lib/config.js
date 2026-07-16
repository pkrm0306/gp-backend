"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadMigrationConfig = loadMigrationConfig;
var fs = require("fs");
var path = require("path");
function loadEnvFile(filePath) {
    if (!fs.existsSync(filePath))
        return;
    var content = fs.readFileSync(filePath, 'utf8');
    for (var _i = 0, _a = content.split(/\r?\n/); _i < _a.length; _i++) {
        var line = _a[_i];
        var trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#'))
            continue;
        var eq = trimmed.indexOf('=');
        if (eq <= 0)
            continue;
        var key = trimmed.slice(0, eq).trim();
        var value = trimmed.slice(eq + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        if (process.env[key] === undefined) {
            process.env[key] = value;
        }
    }
}
function loadMigrationConfig() {
    var _a, _b, _c, _d, _e, _f;
    var root = path.resolve(__dirname, '../../../..');
    loadEnvFile(path.join(root, '.env.migration'));
    loadEnvFile(path.join(root, '.env'));
    var migrationMongoUri = ((_a = process.env.MIGRATION_MONGO_URI) === null || _a === void 0 ? void 0 : _a.trim()) ||
        ((_b = process.env.MONGODB_MIGRATION_URI) === null || _b === void 0 ? void 0 : _b.trim()) ||
        '';
    return {
        mysqlHost: ((_c = process.env.MYSQL_MIGRATION_HOST) === null || _c === void 0 ? void 0 : _c.trim()) || '127.0.0.1',
        mysqlPort: Number(process.env.MYSQL_MIGRATION_PORT || 3307),
        mysqlUser: ((_d = process.env.MYSQL_MIGRATION_USER) === null || _d === void 0 ? void 0 : _d.trim()) || 'greenpro',
        mysqlPassword: process.env.MYSQL_MIGRATION_PASSWORD !== undefined
            ? process.env.MYSQL_MIGRATION_PASSWORD.trim()
            : 'greenpro',
        mysqlDatabase: ((_e = process.env.MYSQL_MIGRATION_DATABASE) === null || _e === void 0 ? void 0 : _e.trim()) || 'greenpro',
        migrationMongoUri: migrationMongoUri,
        appMongoUri: (_f = process.env.MONGODB_URI) === null || _f === void 0 ? void 0 : _f.trim(),
        batchSize: Number(process.env.MIGRATION_BATCH_SIZE || 500),
        dryRun: ['1', 'true', 'yes'].includes(String(process.env.MIGRATION_DRY_RUN || '').toLowerCase()),
        allowLiveTarget: ['1', 'true', 'yes'].includes(String(process.env.ALLOW_LIVE_TARGET || '').toLowerCase()),
    };
}
