"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@nestjs/core");
var mongoose_1 = require("@nestjs/mongoose");
var app_module_1 = require("../app.module");
var vendor_user_schema_1 = require("../vendor-users/schemas/vendor-user.schema");
var role_schema_1 = require("../rbac/schemas/role.schema");
var staff_role_mapping_schema_1 = require("../rbac/schemas/staff-role-mapping.schema");
/**
 * Migrates platform admin/staff users and RBAC rows off manufacturer-scoped records.
 *
 * Run once after deploying optional manufacturerId for admin/staff:
 *   npx ts-node -r tsconfig-paths/register src/scripts/migrate-platform-portal-users.ts
 */
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var app, connection, vendorUserModel, roleModel, mappingModel, session, usersResult, rolesResult, mappingsResult, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, core_1.NestFactory.createApplicationContext(app_module_1.AppModule, {
                        logger: ['error', 'warn', 'log'],
                    })];
                case 1:
                    app = _a.sent();
                    connection = app.get((0, mongoose_1.getConnectionToken)());
                    vendorUserModel = app.get((0, mongoose_1.getModelToken)(vendor_user_schema_1.VendorUser.name));
                    roleModel = app.get((0, mongoose_1.getModelToken)(role_schema_1.Role.name));
                    mappingModel = app.get((0, mongoose_1.getModelToken)(staff_role_mapping_schema_1.StaffRoleMapping.name));
                    return [4 /*yield*/, connection.startSession()];
                case 2:
                    session = _a.sent();
                    session.startTransaction();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 8, 10, 12]);
                    return [4 /*yield*/, vendorUserModel.updateMany({ type: { $in: ['admin', 'staff'] } }, { $unset: { manufacturerId: '', vendorId: '' } }, { session: session })];
                case 4:
                    usersResult = _a.sent();
                    console.log("Unset manufacturerId/vendorId on admin/staff users: ".concat(usersResult.modifiedCount));
                    return [4 /*yield*/, roleModel.updateMany({ manufacturerId: { $exists: true, $ne: null } }, [{ $set: { manufacturerId: null } }], { session: session })];
                case 5:
                    rolesResult = _a.sent();
                    console.log("Moved roles to platform scope: ".concat(rolesResult.modifiedCount));
                    return [4 /*yield*/, mappingModel.updateMany({ manufacturerId: { $exists: true, $ne: null } }, [{ $set: { manufacturerId: null } }], { session: session })];
                case 6:
                    mappingsResult = _a.sent();
                    console.log("Moved staff role mappings to platform scope: ".concat(mappingsResult.modifiedCount));
                    return [4 /*yield*/, session.commitTransaction()];
                case 7:
                    _a.sent();
                    console.log('Platform portal user migration completed');
                    return [3 /*break*/, 12];
                case 8:
                    error_1 = _a.sent();
                    return [4 /*yield*/, session.abortTransaction()];
                case 9:
                    _a.sent();
                    console.error('Platform portal user migration failed', error_1);
                    process.exitCode = 1;
                    return [3 /*break*/, 12];
                case 10:
                    session.endSession();
                    return [4 /*yield*/, app.close()];
                case 11:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    });
}
run();
