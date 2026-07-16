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
exports.readUploadedFileBuffer = readUploadedFileBuffer;
var client_s3_1 = require("@aws-sdk/client-s3");
var fs_1 = require("fs");
var path_1 = require("path");
var s3_config_1 = require("../config/s3.config");
var upload_file_util_1 = require("./upload-file.util");
/** Read a file from local `uploads/` or S3 using a stored document link or relative path. */
function readUploadedFileBuffer(input) {
    return __awaiter(this, void 0, void 0, function () {
        var relativePath, client, response, bytes, _a, fullPath;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    relativePath = (0, upload_file_util_1.normalizeUploadsRelativePath)(String(input !== null && input !== void 0 ? input : ''));
                    if (!relativePath) {
                        return [2 /*return*/, null];
                    }
                    if (!(0, s3_config_1.isS3Configured)()) return [3 /*break*/, 5];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    client = (0, s3_config_1.getS3Client)();
                    return [4 /*yield*/, client.send(new client_s3_1.GetObjectCommand({
                            Bucket: (0, s3_config_1.getS3Bucket)(),
                            Key: "uploads/".concat(relativePath),
                        }))];
                case 2:
                    response = _c.sent();
                    return [4 /*yield*/, ((_b = response.Body) === null || _b === void 0 ? void 0 : _b.transformToByteArray())];
                case 3:
                    bytes = _c.sent();
                    return [2 /*return*/, (bytes === null || bytes === void 0 ? void 0 : bytes.length) ? Buffer.from(bytes) : null];
                case 4:
                    _a = _c.sent();
                    return [2 /*return*/, null];
                case 5:
                    fullPath = (0, path_1.join)(process.cwd(), 'uploads', relativePath);
                    if (!(0, fs_1.existsSync)(fullPath)) {
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, (0, fs_1.readFileSync)(fullPath)];
            }
        });
    });
}
