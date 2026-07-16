"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProcessMpManufacturingUnitDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var optional_non_negative_number_decorator_1 = require("../validators/optional-non-negative-number.decorator");
var optional_number_decorator_1 = require("../validators/optional-number.decorator");
var normalize_renewable_energy_util_1 = require("../utils/normalize-renewable-energy.util");
var CreateProcessMpManufacturingUnitDto = function () {
    var _a;
    var _urnNo_decorators;
    var _urnNo_initializers = [];
    var _urnNo_extraInitializers = [];
    var _unitName_decorators;
    var _unitName_initializers = [];
    var _unitName_extraInitializers = [];
    var _renewableEnergyUtilization_decorators;
    var _renewableEnergyUtilization_initializers = [];
    var _renewableEnergyUtilization_extraInitializers = [];
    var _processMpManufacturingUnitId_decorators;
    var _processMpManufacturingUnitId_initializers = [];
    var _processMpManufacturingUnitId_extraInitializers = [];
    var _ecdYear1_decorators;
    var _ecdYear1_initializers = [];
    var _ecdYear1_extraInitializers = [];
    var _ecdYear2_decorators;
    var _ecdYear2_initializers = [];
    var _ecdYear2_extraInitializers = [];
    var _ecdYear3_decorators;
    var _ecdYear3_initializers = [];
    var _ecdYear3_extraInitializers = [];
    var _ecdProductionUnit_decorators;
    var _ecdProductionUnit_initializers = [];
    var _ecdProductionUnit_extraInitializers = [];
    var _ecdProductionYear1_decorators;
    var _ecdProductionYear1_initializers = [];
    var _ecdProductionYear1_extraInitializers = [];
    var _ecdProductionYear2_decorators;
    var _ecdProductionYear2_initializers = [];
    var _ecdProductionYear2_extraInitializers = [];
    var _ecdProductionYear3_decorators;
    var _ecdProductionYear3_initializers = [];
    var _ecdProductionYear3_extraInitializers = [];
    var _ecdElectricUnit_decorators;
    var _ecdElectricUnit_initializers = [];
    var _ecdElectricUnit_extraInitializers = [];
    var _ecdElectricYear1_decorators;
    var _ecdElectricYear1_initializers = [];
    var _ecdElectricYear1_extraInitializers = [];
    var _ecdElectricYear2_decorators;
    var _ecdElectricYear2_initializers = [];
    var _ecdElectricYear2_extraInitializers = [];
    var _ecdElectricYear3_decorators;
    var _ecdElectricYear3_initializers = [];
    var _ecdElectricYear3_extraInitializers = [];
    var _ecdThermalUnitFuel1_decorators;
    var _ecdThermalUnitFuel1_initializers = [];
    var _ecdThermalUnitFuel1_extraInitializers = [];
    var _ecdThermalUnitFuel2_decorators;
    var _ecdThermalUnitFuel2_initializers = [];
    var _ecdThermalUnitFuel2_extraInitializers = [];
    var _ecdThermalUnitFuel3_decorators;
    var _ecdThermalUnitFuel3_initializers = [];
    var _ecdThermalUnitFuel3_extraInitializers = [];
    var _ecdThermalFuel1Year1_decorators;
    var _ecdThermalFuel1Year1_initializers = [];
    var _ecdThermalFuel1Year1_extraInitializers = [];
    var _ecdThermalFuel1Year2_decorators;
    var _ecdThermalFuel1Year2_initializers = [];
    var _ecdThermalFuel1Year2_extraInitializers = [];
    var _ecdThermalFuel1Year3_decorators;
    var _ecdThermalFuel1Year3_initializers = [];
    var _ecdThermalFuel1Year3_extraInitializers = [];
    var _ecdThermalFuel2Year1_decorators;
    var _ecdThermalFuel2Year1_initializers = [];
    var _ecdThermalFuel2Year1_extraInitializers = [];
    var _ecdThermalFuel2Year2_decorators;
    var _ecdThermalFuel2Year2_initializers = [];
    var _ecdThermalFuel2Year2_extraInitializers = [];
    var _ecdThermalFuel2Year3_decorators;
    var _ecdThermalFuel2Year3_initializers = [];
    var _ecdThermalFuel2Year3_extraInitializers = [];
    var _ecdThermalFuel3Year1_decorators;
    var _ecdThermalFuel3Year1_initializers = [];
    var _ecdThermalFuel3Year1_extraInitializers = [];
    var _ecdThermalFuel3Year2_decorators;
    var _ecdThermalFuel3Year2_initializers = [];
    var _ecdThermalFuel3Year2_extraInitializers = [];
    var _ecdThermalFuel3Year3_decorators;
    var _ecdThermalFuel3Year3_initializers = [];
    var _ecdThermalFuel3Year3_extraInitializers = [];
    var _ecdCalorificFuel1Year1_decorators;
    var _ecdCalorificFuel1Year1_initializers = [];
    var _ecdCalorificFuel1Year1_extraInitializers = [];
    var _ecdCalorificFuel1Year2_decorators;
    var _ecdCalorificFuel1Year2_initializers = [];
    var _ecdCalorificFuel1Year2_extraInitializers = [];
    var _ecdCalorificFuel1Year3_decorators;
    var _ecdCalorificFuel1Year3_initializers = [];
    var _ecdCalorificFuel1Year3_extraInitializers = [];
    var _ecdCalorificFuel2Year1_decorators;
    var _ecdCalorificFuel2Year1_initializers = [];
    var _ecdCalorificFuel2Year1_extraInitializers = [];
    var _ecdCalorificFuel2Year2_decorators;
    var _ecdCalorificFuel2Year2_initializers = [];
    var _ecdCalorificFuel2Year2_extraInitializers = [];
    var _ecdCalorificFuel2Year3_decorators;
    var _ecdCalorificFuel2Year3_initializers = [];
    var _ecdCalorificFuel2Year3_extraInitializers = [];
    var _ecdCalorificFuel3Year1_decorators;
    var _ecdCalorificFuel3Year1_initializers = [];
    var _ecdCalorificFuel3Year1_extraInitializers = [];
    var _ecdCalorificFuel3Year2_decorators;
    var _ecdCalorificFuel3Year2_initializers = [];
    var _ecdCalorificFuel3Year2_extraInitializers = [];
    var _ecdCalorificFuel3Year3_decorators;
    var _ecdCalorificFuel3Year3_initializers = [];
    var _ecdCalorificFuel3Year3_extraInitializers = [];
    var _ecdTextareaNewUnits_decorators;
    var _ecdTextareaNewUnits_initializers = [];
    var _ecdTextareaNewUnits_extraInitializers = [];
    var _wcdYear1_decorators;
    var _wcdYear1_initializers = [];
    var _wcdYear1_extraInitializers = [];
    var _wcdYear2_decorators;
    var _wcdYear2_initializers = [];
    var _wcdYear2_extraInitializers = [];
    var _wcdYear3_decorators;
    var _wcdYear3_initializers = [];
    var _wcdYear3_extraInitializers = [];
    var _wcdProductionUnit_decorators;
    var _wcdProductionUnit_initializers = [];
    var _wcdProductionUnit_extraInitializers = [];
    var _wcdWaterUnit_decorators;
    var _wcdWaterUnit_initializers = [];
    var _wcdWaterUnit_extraInitializers = [];
    var _wcdProductionYear1_decorators;
    var _wcdProductionYear1_initializers = [];
    var _wcdProductionYear1_extraInitializers = [];
    var _wcdProductionYear2_decorators;
    var _wcdProductionYear2_initializers = [];
    var _wcdProductionYear2_extraInitializers = [];
    var _wcdProductionYear3_decorators;
    var _wcdProductionYear3_initializers = [];
    var _wcdProductionYear3_extraInitializers = [];
    var _wcdWaterYear1_decorators;
    var _wcdWaterYear1_initializers = [];
    var _wcdWaterYear1_extraInitializers = [];
    var _wcdWaterYear2_decorators;
    var _wcdWaterYear2_initializers = [];
    var _wcdWaterYear2_extraInitializers = [];
    var _wcdWaterYear3_decorators;
    var _wcdWaterYear3_initializers = [];
    var _wcdWaterYear3_extraInitializers = [];
    var _reYear_decorators;
    var _reYear_initializers = [];
    var _reYear_extraInitializers = [];
    var _reSolarPhotovoltaic_decorators;
    var _reSolarPhotovoltaic_initializers = [];
    var _reSolarPhotovoltaic_extraInitializers = [];
    var _reWind_decorators;
    var _reWind_initializers = [];
    var _reWind_extraInitializers = [];
    var _reBiomass_decorators;
    var _reBiomass_initializers = [];
    var _reBiomass_extraInitializers = [];
    var _reSolarThermal_decorators;
    var _reSolarThermal_initializers = [];
    var _reSolarThermal_extraInitializers = [];
    var _reOthersUnit_decorators;
    var _reOthersUnit_initializers = [];
    var _reOthersUnit_extraInitializers = [];
    var _reOthers_decorators;
    var _reOthers_initializers = [];
    var _reOthers_extraInitializers = [];
    var _offsiteRenewablePower_decorators;
    var _offsiteRenewablePower_initializers = [];
    var _offsiteRenewablePower_extraInitializers = [];
    var _processMpManufacturingUnitStatus_decorators;
    var _processMpManufacturingUnitStatus_initializers = [];
    var _processMpManufacturingUnitStatus_extraInitializers = [];
    var _calculateBulkSec_decorators;
    var _calculateBulkSec_initializers = [];
    var _calculateBulkSec_extraInitializers = [];
    var _calculateBulkSwc_decorators;
    var _calculateBulkSwc_initializers = [];
    var _calculateBulkSwc_extraInitializers = [];
    var _calculateBulkStec_decorators;
    var _calculateBulkStec_initializers = [];
    var _calculateBulkStec_extraInitializers = [];
    var _calculateBulkSecMultipled_decorators;
    var _calculateBulkSecMultipled_initializers = [];
    var _calculateBulkSecMultipled_extraInitializers = [];
    var _calculateBulkSwcMultipled_decorators;
    var _calculateBulkSwcMultipled_initializers = [];
    var _calculateBulkSwcMultipled_extraInitializers = [];
    var _calculateBulkTecMultipled_decorators;
    var _calculateBulkTecMultipled_initializers = [];
    var _calculateBulkTecMultipled_extraInitializers = [];
    var _calculateBulkStecMultipled_decorators;
    var _calculateBulkStecMultipled_initializers = [];
    var _calculateBulkStecMultipled_extraInitializers = [];
    var _measuresImplementedMpUnits_decorators;
    var _measuresImplementedMpUnits_initializers = [];
    var _measuresImplementedMpUnits_extraInitializers = [];
    var _detailsOfRainWaterHarvestingMpUnits_decorators;
    var _detailsOfRainWaterHarvestingMpUnits_initializers = [];
    var _detailsOfRainWaterHarvestingMpUnits_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateProcessMpManufacturingUnitDto() {
                this.urnNo = __runInitializers(this, _urnNo_initializers, void 0);
                this.unitName = (__runInitializers(this, _urnNo_extraInitializers), __runInitializers(this, _unitName_initializers, void 0));
                this.renewableEnergyUtilization = (__runInitializers(this, _unitName_extraInitializers), __runInitializers(this, _renewableEnergyUtilization_initializers, void 0));
                this.processMpManufacturingUnitId = (__runInitializers(this, _renewableEnergyUtilization_extraInitializers), __runInitializers(this, _processMpManufacturingUnitId_initializers, void 0));
                this.ecdYear1 = (__runInitializers(this, _processMpManufacturingUnitId_extraInitializers), __runInitializers(this, _ecdYear1_initializers, void 0));
                this.ecdYear2 = (__runInitializers(this, _ecdYear1_extraInitializers), __runInitializers(this, _ecdYear2_initializers, void 0));
                this.ecdYear3 = (__runInitializers(this, _ecdYear2_extraInitializers), __runInitializers(this, _ecdYear3_initializers, void 0));
                this.ecdProductionUnit = (__runInitializers(this, _ecdYear3_extraInitializers), __runInitializers(this, _ecdProductionUnit_initializers, void 0));
                this.ecdProductionYear1 = (__runInitializers(this, _ecdProductionUnit_extraInitializers), __runInitializers(this, _ecdProductionYear1_initializers, void 0));
                this.ecdProductionYear2 = (__runInitializers(this, _ecdProductionYear1_extraInitializers), __runInitializers(this, _ecdProductionYear2_initializers, void 0));
                this.ecdProductionYear3 = (__runInitializers(this, _ecdProductionYear2_extraInitializers), __runInitializers(this, _ecdProductionYear3_initializers, void 0));
                this.ecdElectricUnit = (__runInitializers(this, _ecdProductionYear3_extraInitializers), __runInitializers(this, _ecdElectricUnit_initializers, void 0));
                this.ecdElectricYear1 = (__runInitializers(this, _ecdElectricUnit_extraInitializers), __runInitializers(this, _ecdElectricYear1_initializers, void 0));
                this.ecdElectricYear2 = (__runInitializers(this, _ecdElectricYear1_extraInitializers), __runInitializers(this, _ecdElectricYear2_initializers, void 0));
                this.ecdElectricYear3 = (__runInitializers(this, _ecdElectricYear2_extraInitializers), __runInitializers(this, _ecdElectricYear3_initializers, void 0));
                this.ecdThermalUnitFuel1 = (__runInitializers(this, _ecdElectricYear3_extraInitializers), __runInitializers(this, _ecdThermalUnitFuel1_initializers, void 0));
                this.ecdThermalUnitFuel2 = (__runInitializers(this, _ecdThermalUnitFuel1_extraInitializers), __runInitializers(this, _ecdThermalUnitFuel2_initializers, void 0));
                this.ecdThermalUnitFuel3 = (__runInitializers(this, _ecdThermalUnitFuel2_extraInitializers), __runInitializers(this, _ecdThermalUnitFuel3_initializers, void 0));
                this.ecdThermalFuel1Year1 = (__runInitializers(this, _ecdThermalUnitFuel3_extraInitializers), __runInitializers(this, _ecdThermalFuel1Year1_initializers, void 0));
                this.ecdThermalFuel1Year2 = (__runInitializers(this, _ecdThermalFuel1Year1_extraInitializers), __runInitializers(this, _ecdThermalFuel1Year2_initializers, void 0));
                this.ecdThermalFuel1Year3 = (__runInitializers(this, _ecdThermalFuel1Year2_extraInitializers), __runInitializers(this, _ecdThermalFuel1Year3_initializers, void 0));
                this.ecdThermalFuel2Year1 = (__runInitializers(this, _ecdThermalFuel1Year3_extraInitializers), __runInitializers(this, _ecdThermalFuel2Year1_initializers, void 0));
                this.ecdThermalFuel2Year2 = (__runInitializers(this, _ecdThermalFuel2Year1_extraInitializers), __runInitializers(this, _ecdThermalFuel2Year2_initializers, void 0));
                this.ecdThermalFuel2Year3 = (__runInitializers(this, _ecdThermalFuel2Year2_extraInitializers), __runInitializers(this, _ecdThermalFuel2Year3_initializers, void 0));
                this.ecdThermalFuel3Year1 = (__runInitializers(this, _ecdThermalFuel2Year3_extraInitializers), __runInitializers(this, _ecdThermalFuel3Year1_initializers, void 0));
                this.ecdThermalFuel3Year2 = (__runInitializers(this, _ecdThermalFuel3Year1_extraInitializers), __runInitializers(this, _ecdThermalFuel3Year2_initializers, void 0));
                this.ecdThermalFuel3Year3 = (__runInitializers(this, _ecdThermalFuel3Year2_extraInitializers), __runInitializers(this, _ecdThermalFuel3Year3_initializers, void 0));
                this.ecdCalorificFuel1Year1 = (__runInitializers(this, _ecdThermalFuel3Year3_extraInitializers), __runInitializers(this, _ecdCalorificFuel1Year1_initializers, void 0));
                this.ecdCalorificFuel1Year2 = (__runInitializers(this, _ecdCalorificFuel1Year1_extraInitializers), __runInitializers(this, _ecdCalorificFuel1Year2_initializers, void 0));
                this.ecdCalorificFuel1Year3 = (__runInitializers(this, _ecdCalorificFuel1Year2_extraInitializers), __runInitializers(this, _ecdCalorificFuel1Year3_initializers, void 0));
                this.ecdCalorificFuel2Year1 = (__runInitializers(this, _ecdCalorificFuel1Year3_extraInitializers), __runInitializers(this, _ecdCalorificFuel2Year1_initializers, void 0));
                this.ecdCalorificFuel2Year2 = (__runInitializers(this, _ecdCalorificFuel2Year1_extraInitializers), __runInitializers(this, _ecdCalorificFuel2Year2_initializers, void 0));
                this.ecdCalorificFuel2Year3 = (__runInitializers(this, _ecdCalorificFuel2Year2_extraInitializers), __runInitializers(this, _ecdCalorificFuel2Year3_initializers, void 0));
                this.ecdCalorificFuel3Year1 = (__runInitializers(this, _ecdCalorificFuel2Year3_extraInitializers), __runInitializers(this, _ecdCalorificFuel3Year1_initializers, void 0));
                this.ecdCalorificFuel3Year2 = (__runInitializers(this, _ecdCalorificFuel3Year1_extraInitializers), __runInitializers(this, _ecdCalorificFuel3Year2_initializers, void 0));
                this.ecdCalorificFuel3Year3 = (__runInitializers(this, _ecdCalorificFuel3Year2_extraInitializers), __runInitializers(this, _ecdCalorificFuel3Year3_initializers, void 0));
                this.ecdTextareaNewUnits = (__runInitializers(this, _ecdCalorificFuel3Year3_extraInitializers), __runInitializers(this, _ecdTextareaNewUnits_initializers, void 0));
                this.wcdYear1 = (__runInitializers(this, _ecdTextareaNewUnits_extraInitializers), __runInitializers(this, _wcdYear1_initializers, void 0));
                this.wcdYear2 = (__runInitializers(this, _wcdYear1_extraInitializers), __runInitializers(this, _wcdYear2_initializers, void 0));
                this.wcdYear3 = (__runInitializers(this, _wcdYear2_extraInitializers), __runInitializers(this, _wcdYear3_initializers, void 0));
                this.wcdProductionUnit = (__runInitializers(this, _wcdYear3_extraInitializers), __runInitializers(this, _wcdProductionUnit_initializers, void 0));
                this.wcdWaterUnit = (__runInitializers(this, _wcdProductionUnit_extraInitializers), __runInitializers(this, _wcdWaterUnit_initializers, void 0));
                this.wcdProductionYear1 = (__runInitializers(this, _wcdWaterUnit_extraInitializers), __runInitializers(this, _wcdProductionYear1_initializers, void 0));
                this.wcdProductionYear2 = (__runInitializers(this, _wcdProductionYear1_extraInitializers), __runInitializers(this, _wcdProductionYear2_initializers, void 0));
                this.wcdProductionYear3 = (__runInitializers(this, _wcdProductionYear2_extraInitializers), __runInitializers(this, _wcdProductionYear3_initializers, void 0));
                this.wcdWaterYear1 = (__runInitializers(this, _wcdProductionYear3_extraInitializers), __runInitializers(this, _wcdWaterYear1_initializers, void 0));
                this.wcdWaterYear2 = (__runInitializers(this, _wcdWaterYear1_extraInitializers), __runInitializers(this, _wcdWaterYear2_initializers, void 0));
                this.wcdWaterYear3 = (__runInitializers(this, _wcdWaterYear2_extraInitializers), __runInitializers(this, _wcdWaterYear3_initializers, void 0));
                this.reYear = (__runInitializers(this, _wcdWaterYear3_extraInitializers), __runInitializers(this, _reYear_initializers, void 0));
                this.reSolarPhotovoltaic = (__runInitializers(this, _reYear_extraInitializers), __runInitializers(this, _reSolarPhotovoltaic_initializers, void 0));
                this.reWind = (__runInitializers(this, _reSolarPhotovoltaic_extraInitializers), __runInitializers(this, _reWind_initializers, void 0));
                this.reBiomass = (__runInitializers(this, _reWind_extraInitializers), __runInitializers(this, _reBiomass_initializers, void 0));
                this.reSolarThermal = (__runInitializers(this, _reBiomass_extraInitializers), __runInitializers(this, _reSolarThermal_initializers, void 0));
                this.reOthersUnit = (__runInitializers(this, _reSolarThermal_extraInitializers), __runInitializers(this, _reOthersUnit_initializers, void 0));
                this.reOthers = (__runInitializers(this, _reOthersUnit_extraInitializers), __runInitializers(this, _reOthers_initializers, void 0));
                this.offsiteRenewablePower = (__runInitializers(this, _reOthers_extraInitializers), __runInitializers(this, _offsiteRenewablePower_initializers, void 0));
                this.processMpManufacturingUnitStatus = (__runInitializers(this, _offsiteRenewablePower_extraInitializers), __runInitializers(this, _processMpManufacturingUnitStatus_initializers, void 0));
                this.calculateBulkSec = (__runInitializers(this, _processMpManufacturingUnitStatus_extraInitializers), __runInitializers(this, _calculateBulkSec_initializers, void 0));
                this.calculateBulkSwc = (__runInitializers(this, _calculateBulkSec_extraInitializers), __runInitializers(this, _calculateBulkSwc_initializers, void 0));
                this.calculateBulkStec = (__runInitializers(this, _calculateBulkSwc_extraInitializers), __runInitializers(this, _calculateBulkStec_initializers, void 0));
                this.calculateBulkSecMultipled = (__runInitializers(this, _calculateBulkStec_extraInitializers), __runInitializers(this, _calculateBulkSecMultipled_initializers, void 0));
                this.calculateBulkSwcMultipled = (__runInitializers(this, _calculateBulkSecMultipled_extraInitializers), __runInitializers(this, _calculateBulkSwcMultipled_initializers, void 0));
                this.calculateBulkTecMultipled = (__runInitializers(this, _calculateBulkSwcMultipled_extraInitializers), __runInitializers(this, _calculateBulkTecMultipled_initializers, void 0));
                this.calculateBulkStecMultipled = (__runInitializers(this, _calculateBulkTecMultipled_extraInitializers), __runInitializers(this, _calculateBulkStecMultipled_initializers, void 0));
                this.measuresImplementedMpUnits = (__runInitializers(this, _calculateBulkStecMultipled_extraInitializers), __runInitializers(this, _measuresImplementedMpUnits_initializers, void 0));
                this.detailsOfRainWaterHarvestingMpUnits = (__runInitializers(this, _measuresImplementedMpUnits_extraInitializers), __runInitializers(this, _detailsOfRainWaterHarvestingMpUnits_initializers, void 0));
                __runInitializers(this, _detailsOfRainWaterHarvestingMpUnits_extraInitializers);
            }
            return CreateProcessMpManufacturingUnitDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _urnNo_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'URN number',
                    example: 'URN-20260305124230',
                    required: true,
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _unitName_decorators = [(0, swagger_1.ApiProperty)({ description: 'Unit name', required: false, example: 'Unit A' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _renewableEnergyUtilization_decorators = [(0, swagger_1.ApiProperty)({
                    description: "Renewable energy utilization (stored as yes/no; accepts 1/0, 2=no, booleans, off/none, etc.)",
                    required: false,
                    enum: ['yes', 'no'],
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return (0, normalize_renewable_energy_util_1.normalizeRenewableEnergyUtilization)(value);
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsIn)(['yes', 'no'])];
            _processMpManufacturingUnitId_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Existing unit id — when provided, updates that row instead of creating',
                    required: false,
                    example: 15,
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    if (value === undefined || value === null || value === '')
                        return undefined;
                    var n = Number(value);
                    return Number.isFinite(n) ? n : value;
                }), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _ecdYear1_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _ecdYear2_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _ecdYear3_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _ecdProductionUnit_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _ecdProductionYear1_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_transformer_1.Type)(function () { return Number; }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _ecdProductionYear2_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_transformer_1.Type)(function () { return Number; }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _ecdProductionYear3_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_transformer_1.Type)(function () { return Number; }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _ecdElectricUnit_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _ecdElectricYear1_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_transformer_1.Type)(function () { return Number; }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _ecdElectricYear2_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_transformer_1.Type)(function () { return Number; }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _ecdElectricYear3_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_transformer_1.Type)(function () { return Number; }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _ecdThermalUnitFuel1_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _ecdThermalUnitFuel2_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _ecdThermalUnitFuel3_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _ecdThermalFuel1Year1_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _ecdThermalFuel1Year2_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _ecdThermalFuel1Year3_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _ecdThermalFuel2Year1_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _ecdThermalFuel2Year2_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _ecdThermalFuel2Year3_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _ecdThermalFuel3Year1_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _ecdThermalFuel3Year2_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _ecdThermalFuel3Year3_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _ecdCalorificFuel1Year1_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _ecdCalorificFuel1Year2_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _ecdCalorificFuel1Year3_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _ecdCalorificFuel2Year1_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _ecdCalorificFuel2Year2_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _ecdCalorificFuel2Year3_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _ecdCalorificFuel3Year1_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _ecdCalorificFuel3Year2_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _ecdCalorificFuel3Year3_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _ecdTextareaNewUnits_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _wcdYear1_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _wcdYear2_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _wcdYear3_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _wcdProductionUnit_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _wcdWaterUnit_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _wcdProductionYear1_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_transformer_1.Type)(function () { return Number; }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _wcdProductionYear2_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_transformer_1.Type)(function () { return Number; }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _wcdProductionYear3_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_transformer_1.Type)(function () { return Number; }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _wcdWaterYear1_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_transformer_1.Type)(function () { return Number; }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _wcdWaterYear2_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_transformer_1.Type)(function () { return Number; }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _wcdWaterYear3_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_transformer_1.Type)(function () { return Number; }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _reYear_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _reSolarPhotovoltaic_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _reWind_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _reBiomass_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _reSolarThermal_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _reOthersUnit_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _reOthers_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _offsiteRenewablePower_decorators = [(0, swagger_1.ApiProperty)({
                    required: false,
                    description: 'Offsite renewable power (0/1 or count)',
                    example: 0,
                }), (0, optional_non_negative_number_decorator_1.IsOptionalNonNegativeNumber)()];
            _processMpManufacturingUnitStatus_decorators = [(0, swagger_1.ApiProperty)({
                    required: false,
                    description: 'Status (0=Pending, 1=Completed)',
                    enum: [0, 1],
                    example: 0,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_validator_1.IsIn)([0, 1])];
            _calculateBulkSec_decorators = [(0, swagger_1.ApiProperty)({
                    required: false,
                    description: 'Bulk SEC balance (may be negative when derived from auto-calculation).',
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    if (value === undefined || value === null || value === '')
                        return undefined;
                    var n = Number(value);
                    return Number.isFinite(n) ? n : value;
                }), (0, optional_number_decorator_1.IsOptionalNumber)()];
            _calculateBulkSwc_decorators = [(0, swagger_1.ApiProperty)({
                    required: false,
                    description: 'Bulk SWC balance (may be negative when derived from auto-calculation).',
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    if (value === undefined || value === null || value === '')
                        return undefined;
                    var n = Number(value);
                    return Number.isFinite(n) ? n : value;
                }), (0, optional_number_decorator_1.IsOptionalNumber)()];
            _calculateBulkStec_decorators = [(0, swagger_1.ApiProperty)({
                    required: false,
                    description: 'Bulk STEC reduction (may be negative when derived from auto-calculation).',
                }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    if (value === undefined || value === null || value === '')
                        return undefined;
                    var n = Number(value);
                    return Number.isFinite(n) ? n : value;
                }), (0, optional_number_decorator_1.IsOptionalNumber)()];
            _calculateBulkSecMultipled_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _calculateBulkSwcMultipled_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _calculateBulkTecMultipled_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _calculateBulkStecMultipled_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _measuresImplementedMpUnits_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _detailsOfRainWaterHarvestingMpUnits_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _urnNo_decorators, { kind: "field", name: "urnNo", static: false, private: false, access: { has: function (obj) { return "urnNo" in obj; }, get: function (obj) { return obj.urnNo; }, set: function (obj, value) { obj.urnNo = value; } }, metadata: _metadata }, _urnNo_initializers, _urnNo_extraInitializers);
            __esDecorate(null, null, _unitName_decorators, { kind: "field", name: "unitName", static: false, private: false, access: { has: function (obj) { return "unitName" in obj; }, get: function (obj) { return obj.unitName; }, set: function (obj, value) { obj.unitName = value; } }, metadata: _metadata }, _unitName_initializers, _unitName_extraInitializers);
            __esDecorate(null, null, _renewableEnergyUtilization_decorators, { kind: "field", name: "renewableEnergyUtilization", static: false, private: false, access: { has: function (obj) { return "renewableEnergyUtilization" in obj; }, get: function (obj) { return obj.renewableEnergyUtilization; }, set: function (obj, value) { obj.renewableEnergyUtilization = value; } }, metadata: _metadata }, _renewableEnergyUtilization_initializers, _renewableEnergyUtilization_extraInitializers);
            __esDecorate(null, null, _processMpManufacturingUnitId_decorators, { kind: "field", name: "processMpManufacturingUnitId", static: false, private: false, access: { has: function (obj) { return "processMpManufacturingUnitId" in obj; }, get: function (obj) { return obj.processMpManufacturingUnitId; }, set: function (obj, value) { obj.processMpManufacturingUnitId = value; } }, metadata: _metadata }, _processMpManufacturingUnitId_initializers, _processMpManufacturingUnitId_extraInitializers);
            __esDecorate(null, null, _ecdYear1_decorators, { kind: "field", name: "ecdYear1", static: false, private: false, access: { has: function (obj) { return "ecdYear1" in obj; }, get: function (obj) { return obj.ecdYear1; }, set: function (obj, value) { obj.ecdYear1 = value; } }, metadata: _metadata }, _ecdYear1_initializers, _ecdYear1_extraInitializers);
            __esDecorate(null, null, _ecdYear2_decorators, { kind: "field", name: "ecdYear2", static: false, private: false, access: { has: function (obj) { return "ecdYear2" in obj; }, get: function (obj) { return obj.ecdYear2; }, set: function (obj, value) { obj.ecdYear2 = value; } }, metadata: _metadata }, _ecdYear2_initializers, _ecdYear2_extraInitializers);
            __esDecorate(null, null, _ecdYear3_decorators, { kind: "field", name: "ecdYear3", static: false, private: false, access: { has: function (obj) { return "ecdYear3" in obj; }, get: function (obj) { return obj.ecdYear3; }, set: function (obj, value) { obj.ecdYear3 = value; } }, metadata: _metadata }, _ecdYear3_initializers, _ecdYear3_extraInitializers);
            __esDecorate(null, null, _ecdProductionUnit_decorators, { kind: "field", name: "ecdProductionUnit", static: false, private: false, access: { has: function (obj) { return "ecdProductionUnit" in obj; }, get: function (obj) { return obj.ecdProductionUnit; }, set: function (obj, value) { obj.ecdProductionUnit = value; } }, metadata: _metadata }, _ecdProductionUnit_initializers, _ecdProductionUnit_extraInitializers);
            __esDecorate(null, null, _ecdProductionYear1_decorators, { kind: "field", name: "ecdProductionYear1", static: false, private: false, access: { has: function (obj) { return "ecdProductionYear1" in obj; }, get: function (obj) { return obj.ecdProductionYear1; }, set: function (obj, value) { obj.ecdProductionYear1 = value; } }, metadata: _metadata }, _ecdProductionYear1_initializers, _ecdProductionYear1_extraInitializers);
            __esDecorate(null, null, _ecdProductionYear2_decorators, { kind: "field", name: "ecdProductionYear2", static: false, private: false, access: { has: function (obj) { return "ecdProductionYear2" in obj; }, get: function (obj) { return obj.ecdProductionYear2; }, set: function (obj, value) { obj.ecdProductionYear2 = value; } }, metadata: _metadata }, _ecdProductionYear2_initializers, _ecdProductionYear2_extraInitializers);
            __esDecorate(null, null, _ecdProductionYear3_decorators, { kind: "field", name: "ecdProductionYear3", static: false, private: false, access: { has: function (obj) { return "ecdProductionYear3" in obj; }, get: function (obj) { return obj.ecdProductionYear3; }, set: function (obj, value) { obj.ecdProductionYear3 = value; } }, metadata: _metadata }, _ecdProductionYear3_initializers, _ecdProductionYear3_extraInitializers);
            __esDecorate(null, null, _ecdElectricUnit_decorators, { kind: "field", name: "ecdElectricUnit", static: false, private: false, access: { has: function (obj) { return "ecdElectricUnit" in obj; }, get: function (obj) { return obj.ecdElectricUnit; }, set: function (obj, value) { obj.ecdElectricUnit = value; } }, metadata: _metadata }, _ecdElectricUnit_initializers, _ecdElectricUnit_extraInitializers);
            __esDecorate(null, null, _ecdElectricYear1_decorators, { kind: "field", name: "ecdElectricYear1", static: false, private: false, access: { has: function (obj) { return "ecdElectricYear1" in obj; }, get: function (obj) { return obj.ecdElectricYear1; }, set: function (obj, value) { obj.ecdElectricYear1 = value; } }, metadata: _metadata }, _ecdElectricYear1_initializers, _ecdElectricYear1_extraInitializers);
            __esDecorate(null, null, _ecdElectricYear2_decorators, { kind: "field", name: "ecdElectricYear2", static: false, private: false, access: { has: function (obj) { return "ecdElectricYear2" in obj; }, get: function (obj) { return obj.ecdElectricYear2; }, set: function (obj, value) { obj.ecdElectricYear2 = value; } }, metadata: _metadata }, _ecdElectricYear2_initializers, _ecdElectricYear2_extraInitializers);
            __esDecorate(null, null, _ecdElectricYear3_decorators, { kind: "field", name: "ecdElectricYear3", static: false, private: false, access: { has: function (obj) { return "ecdElectricYear3" in obj; }, get: function (obj) { return obj.ecdElectricYear3; }, set: function (obj, value) { obj.ecdElectricYear3 = value; } }, metadata: _metadata }, _ecdElectricYear3_initializers, _ecdElectricYear3_extraInitializers);
            __esDecorate(null, null, _ecdThermalUnitFuel1_decorators, { kind: "field", name: "ecdThermalUnitFuel1", static: false, private: false, access: { has: function (obj) { return "ecdThermalUnitFuel1" in obj; }, get: function (obj) { return obj.ecdThermalUnitFuel1; }, set: function (obj, value) { obj.ecdThermalUnitFuel1 = value; } }, metadata: _metadata }, _ecdThermalUnitFuel1_initializers, _ecdThermalUnitFuel1_extraInitializers);
            __esDecorate(null, null, _ecdThermalUnitFuel2_decorators, { kind: "field", name: "ecdThermalUnitFuel2", static: false, private: false, access: { has: function (obj) { return "ecdThermalUnitFuel2" in obj; }, get: function (obj) { return obj.ecdThermalUnitFuel2; }, set: function (obj, value) { obj.ecdThermalUnitFuel2 = value; } }, metadata: _metadata }, _ecdThermalUnitFuel2_initializers, _ecdThermalUnitFuel2_extraInitializers);
            __esDecorate(null, null, _ecdThermalUnitFuel3_decorators, { kind: "field", name: "ecdThermalUnitFuel3", static: false, private: false, access: { has: function (obj) { return "ecdThermalUnitFuel3" in obj; }, get: function (obj) { return obj.ecdThermalUnitFuel3; }, set: function (obj, value) { obj.ecdThermalUnitFuel3 = value; } }, metadata: _metadata }, _ecdThermalUnitFuel3_initializers, _ecdThermalUnitFuel3_extraInitializers);
            __esDecorate(null, null, _ecdThermalFuel1Year1_decorators, { kind: "field", name: "ecdThermalFuel1Year1", static: false, private: false, access: { has: function (obj) { return "ecdThermalFuel1Year1" in obj; }, get: function (obj) { return obj.ecdThermalFuel1Year1; }, set: function (obj, value) { obj.ecdThermalFuel1Year1 = value; } }, metadata: _metadata }, _ecdThermalFuel1Year1_initializers, _ecdThermalFuel1Year1_extraInitializers);
            __esDecorate(null, null, _ecdThermalFuel1Year2_decorators, { kind: "field", name: "ecdThermalFuel1Year2", static: false, private: false, access: { has: function (obj) { return "ecdThermalFuel1Year2" in obj; }, get: function (obj) { return obj.ecdThermalFuel1Year2; }, set: function (obj, value) { obj.ecdThermalFuel1Year2 = value; } }, metadata: _metadata }, _ecdThermalFuel1Year2_initializers, _ecdThermalFuel1Year2_extraInitializers);
            __esDecorate(null, null, _ecdThermalFuel1Year3_decorators, { kind: "field", name: "ecdThermalFuel1Year3", static: false, private: false, access: { has: function (obj) { return "ecdThermalFuel1Year3" in obj; }, get: function (obj) { return obj.ecdThermalFuel1Year3; }, set: function (obj, value) { obj.ecdThermalFuel1Year3 = value; } }, metadata: _metadata }, _ecdThermalFuel1Year3_initializers, _ecdThermalFuel1Year3_extraInitializers);
            __esDecorate(null, null, _ecdThermalFuel2Year1_decorators, { kind: "field", name: "ecdThermalFuel2Year1", static: false, private: false, access: { has: function (obj) { return "ecdThermalFuel2Year1" in obj; }, get: function (obj) { return obj.ecdThermalFuel2Year1; }, set: function (obj, value) { obj.ecdThermalFuel2Year1 = value; } }, metadata: _metadata }, _ecdThermalFuel2Year1_initializers, _ecdThermalFuel2Year1_extraInitializers);
            __esDecorate(null, null, _ecdThermalFuel2Year2_decorators, { kind: "field", name: "ecdThermalFuel2Year2", static: false, private: false, access: { has: function (obj) { return "ecdThermalFuel2Year2" in obj; }, get: function (obj) { return obj.ecdThermalFuel2Year2; }, set: function (obj, value) { obj.ecdThermalFuel2Year2 = value; } }, metadata: _metadata }, _ecdThermalFuel2Year2_initializers, _ecdThermalFuel2Year2_extraInitializers);
            __esDecorate(null, null, _ecdThermalFuel2Year3_decorators, { kind: "field", name: "ecdThermalFuel2Year3", static: false, private: false, access: { has: function (obj) { return "ecdThermalFuel2Year3" in obj; }, get: function (obj) { return obj.ecdThermalFuel2Year3; }, set: function (obj, value) { obj.ecdThermalFuel2Year3 = value; } }, metadata: _metadata }, _ecdThermalFuel2Year3_initializers, _ecdThermalFuel2Year3_extraInitializers);
            __esDecorate(null, null, _ecdThermalFuel3Year1_decorators, { kind: "field", name: "ecdThermalFuel3Year1", static: false, private: false, access: { has: function (obj) { return "ecdThermalFuel3Year1" in obj; }, get: function (obj) { return obj.ecdThermalFuel3Year1; }, set: function (obj, value) { obj.ecdThermalFuel3Year1 = value; } }, metadata: _metadata }, _ecdThermalFuel3Year1_initializers, _ecdThermalFuel3Year1_extraInitializers);
            __esDecorate(null, null, _ecdThermalFuel3Year2_decorators, { kind: "field", name: "ecdThermalFuel3Year2", static: false, private: false, access: { has: function (obj) { return "ecdThermalFuel3Year2" in obj; }, get: function (obj) { return obj.ecdThermalFuel3Year2; }, set: function (obj, value) { obj.ecdThermalFuel3Year2 = value; } }, metadata: _metadata }, _ecdThermalFuel3Year2_initializers, _ecdThermalFuel3Year2_extraInitializers);
            __esDecorate(null, null, _ecdThermalFuel3Year3_decorators, { kind: "field", name: "ecdThermalFuel3Year3", static: false, private: false, access: { has: function (obj) { return "ecdThermalFuel3Year3" in obj; }, get: function (obj) { return obj.ecdThermalFuel3Year3; }, set: function (obj, value) { obj.ecdThermalFuel3Year3 = value; } }, metadata: _metadata }, _ecdThermalFuel3Year3_initializers, _ecdThermalFuel3Year3_extraInitializers);
            __esDecorate(null, null, _ecdCalorificFuel1Year1_decorators, { kind: "field", name: "ecdCalorificFuel1Year1", static: false, private: false, access: { has: function (obj) { return "ecdCalorificFuel1Year1" in obj; }, get: function (obj) { return obj.ecdCalorificFuel1Year1; }, set: function (obj, value) { obj.ecdCalorificFuel1Year1 = value; } }, metadata: _metadata }, _ecdCalorificFuel1Year1_initializers, _ecdCalorificFuel1Year1_extraInitializers);
            __esDecorate(null, null, _ecdCalorificFuel1Year2_decorators, { kind: "field", name: "ecdCalorificFuel1Year2", static: false, private: false, access: { has: function (obj) { return "ecdCalorificFuel1Year2" in obj; }, get: function (obj) { return obj.ecdCalorificFuel1Year2; }, set: function (obj, value) { obj.ecdCalorificFuel1Year2 = value; } }, metadata: _metadata }, _ecdCalorificFuel1Year2_initializers, _ecdCalorificFuel1Year2_extraInitializers);
            __esDecorate(null, null, _ecdCalorificFuel1Year3_decorators, { kind: "field", name: "ecdCalorificFuel1Year3", static: false, private: false, access: { has: function (obj) { return "ecdCalorificFuel1Year3" in obj; }, get: function (obj) { return obj.ecdCalorificFuel1Year3; }, set: function (obj, value) { obj.ecdCalorificFuel1Year3 = value; } }, metadata: _metadata }, _ecdCalorificFuel1Year3_initializers, _ecdCalorificFuel1Year3_extraInitializers);
            __esDecorate(null, null, _ecdCalorificFuel2Year1_decorators, { kind: "field", name: "ecdCalorificFuel2Year1", static: false, private: false, access: { has: function (obj) { return "ecdCalorificFuel2Year1" in obj; }, get: function (obj) { return obj.ecdCalorificFuel2Year1; }, set: function (obj, value) { obj.ecdCalorificFuel2Year1 = value; } }, metadata: _metadata }, _ecdCalorificFuel2Year1_initializers, _ecdCalorificFuel2Year1_extraInitializers);
            __esDecorate(null, null, _ecdCalorificFuel2Year2_decorators, { kind: "field", name: "ecdCalorificFuel2Year2", static: false, private: false, access: { has: function (obj) { return "ecdCalorificFuel2Year2" in obj; }, get: function (obj) { return obj.ecdCalorificFuel2Year2; }, set: function (obj, value) { obj.ecdCalorificFuel2Year2 = value; } }, metadata: _metadata }, _ecdCalorificFuel2Year2_initializers, _ecdCalorificFuel2Year2_extraInitializers);
            __esDecorate(null, null, _ecdCalorificFuel2Year3_decorators, { kind: "field", name: "ecdCalorificFuel2Year3", static: false, private: false, access: { has: function (obj) { return "ecdCalorificFuel2Year3" in obj; }, get: function (obj) { return obj.ecdCalorificFuel2Year3; }, set: function (obj, value) { obj.ecdCalorificFuel2Year3 = value; } }, metadata: _metadata }, _ecdCalorificFuel2Year3_initializers, _ecdCalorificFuel2Year3_extraInitializers);
            __esDecorate(null, null, _ecdCalorificFuel3Year1_decorators, { kind: "field", name: "ecdCalorificFuel3Year1", static: false, private: false, access: { has: function (obj) { return "ecdCalorificFuel3Year1" in obj; }, get: function (obj) { return obj.ecdCalorificFuel3Year1; }, set: function (obj, value) { obj.ecdCalorificFuel3Year1 = value; } }, metadata: _metadata }, _ecdCalorificFuel3Year1_initializers, _ecdCalorificFuel3Year1_extraInitializers);
            __esDecorate(null, null, _ecdCalorificFuel3Year2_decorators, { kind: "field", name: "ecdCalorificFuel3Year2", static: false, private: false, access: { has: function (obj) { return "ecdCalorificFuel3Year2" in obj; }, get: function (obj) { return obj.ecdCalorificFuel3Year2; }, set: function (obj, value) { obj.ecdCalorificFuel3Year2 = value; } }, metadata: _metadata }, _ecdCalorificFuel3Year2_initializers, _ecdCalorificFuel3Year2_extraInitializers);
            __esDecorate(null, null, _ecdCalorificFuel3Year3_decorators, { kind: "field", name: "ecdCalorificFuel3Year3", static: false, private: false, access: { has: function (obj) { return "ecdCalorificFuel3Year3" in obj; }, get: function (obj) { return obj.ecdCalorificFuel3Year3; }, set: function (obj, value) { obj.ecdCalorificFuel3Year3 = value; } }, metadata: _metadata }, _ecdCalorificFuel3Year3_initializers, _ecdCalorificFuel3Year3_extraInitializers);
            __esDecorate(null, null, _ecdTextareaNewUnits_decorators, { kind: "field", name: "ecdTextareaNewUnits", static: false, private: false, access: { has: function (obj) { return "ecdTextareaNewUnits" in obj; }, get: function (obj) { return obj.ecdTextareaNewUnits; }, set: function (obj, value) { obj.ecdTextareaNewUnits = value; } }, metadata: _metadata }, _ecdTextareaNewUnits_initializers, _ecdTextareaNewUnits_extraInitializers);
            __esDecorate(null, null, _wcdYear1_decorators, { kind: "field", name: "wcdYear1", static: false, private: false, access: { has: function (obj) { return "wcdYear1" in obj; }, get: function (obj) { return obj.wcdYear1; }, set: function (obj, value) { obj.wcdYear1 = value; } }, metadata: _metadata }, _wcdYear1_initializers, _wcdYear1_extraInitializers);
            __esDecorate(null, null, _wcdYear2_decorators, { kind: "field", name: "wcdYear2", static: false, private: false, access: { has: function (obj) { return "wcdYear2" in obj; }, get: function (obj) { return obj.wcdYear2; }, set: function (obj, value) { obj.wcdYear2 = value; } }, metadata: _metadata }, _wcdYear2_initializers, _wcdYear2_extraInitializers);
            __esDecorate(null, null, _wcdYear3_decorators, { kind: "field", name: "wcdYear3", static: false, private: false, access: { has: function (obj) { return "wcdYear3" in obj; }, get: function (obj) { return obj.wcdYear3; }, set: function (obj, value) { obj.wcdYear3 = value; } }, metadata: _metadata }, _wcdYear3_initializers, _wcdYear3_extraInitializers);
            __esDecorate(null, null, _wcdProductionUnit_decorators, { kind: "field", name: "wcdProductionUnit", static: false, private: false, access: { has: function (obj) { return "wcdProductionUnit" in obj; }, get: function (obj) { return obj.wcdProductionUnit; }, set: function (obj, value) { obj.wcdProductionUnit = value; } }, metadata: _metadata }, _wcdProductionUnit_initializers, _wcdProductionUnit_extraInitializers);
            __esDecorate(null, null, _wcdWaterUnit_decorators, { kind: "field", name: "wcdWaterUnit", static: false, private: false, access: { has: function (obj) { return "wcdWaterUnit" in obj; }, get: function (obj) { return obj.wcdWaterUnit; }, set: function (obj, value) { obj.wcdWaterUnit = value; } }, metadata: _metadata }, _wcdWaterUnit_initializers, _wcdWaterUnit_extraInitializers);
            __esDecorate(null, null, _wcdProductionYear1_decorators, { kind: "field", name: "wcdProductionYear1", static: false, private: false, access: { has: function (obj) { return "wcdProductionYear1" in obj; }, get: function (obj) { return obj.wcdProductionYear1; }, set: function (obj, value) { obj.wcdProductionYear1 = value; } }, metadata: _metadata }, _wcdProductionYear1_initializers, _wcdProductionYear1_extraInitializers);
            __esDecorate(null, null, _wcdProductionYear2_decorators, { kind: "field", name: "wcdProductionYear2", static: false, private: false, access: { has: function (obj) { return "wcdProductionYear2" in obj; }, get: function (obj) { return obj.wcdProductionYear2; }, set: function (obj, value) { obj.wcdProductionYear2 = value; } }, metadata: _metadata }, _wcdProductionYear2_initializers, _wcdProductionYear2_extraInitializers);
            __esDecorate(null, null, _wcdProductionYear3_decorators, { kind: "field", name: "wcdProductionYear3", static: false, private: false, access: { has: function (obj) { return "wcdProductionYear3" in obj; }, get: function (obj) { return obj.wcdProductionYear3; }, set: function (obj, value) { obj.wcdProductionYear3 = value; } }, metadata: _metadata }, _wcdProductionYear3_initializers, _wcdProductionYear3_extraInitializers);
            __esDecorate(null, null, _wcdWaterYear1_decorators, { kind: "field", name: "wcdWaterYear1", static: false, private: false, access: { has: function (obj) { return "wcdWaterYear1" in obj; }, get: function (obj) { return obj.wcdWaterYear1; }, set: function (obj, value) { obj.wcdWaterYear1 = value; } }, metadata: _metadata }, _wcdWaterYear1_initializers, _wcdWaterYear1_extraInitializers);
            __esDecorate(null, null, _wcdWaterYear2_decorators, { kind: "field", name: "wcdWaterYear2", static: false, private: false, access: { has: function (obj) { return "wcdWaterYear2" in obj; }, get: function (obj) { return obj.wcdWaterYear2; }, set: function (obj, value) { obj.wcdWaterYear2 = value; } }, metadata: _metadata }, _wcdWaterYear2_initializers, _wcdWaterYear2_extraInitializers);
            __esDecorate(null, null, _wcdWaterYear3_decorators, { kind: "field", name: "wcdWaterYear3", static: false, private: false, access: { has: function (obj) { return "wcdWaterYear3" in obj; }, get: function (obj) { return obj.wcdWaterYear3; }, set: function (obj, value) { obj.wcdWaterYear3 = value; } }, metadata: _metadata }, _wcdWaterYear3_initializers, _wcdWaterYear3_extraInitializers);
            __esDecorate(null, null, _reYear_decorators, { kind: "field", name: "reYear", static: false, private: false, access: { has: function (obj) { return "reYear" in obj; }, get: function (obj) { return obj.reYear; }, set: function (obj, value) { obj.reYear = value; } }, metadata: _metadata }, _reYear_initializers, _reYear_extraInitializers);
            __esDecorate(null, null, _reSolarPhotovoltaic_decorators, { kind: "field", name: "reSolarPhotovoltaic", static: false, private: false, access: { has: function (obj) { return "reSolarPhotovoltaic" in obj; }, get: function (obj) { return obj.reSolarPhotovoltaic; }, set: function (obj, value) { obj.reSolarPhotovoltaic = value; } }, metadata: _metadata }, _reSolarPhotovoltaic_initializers, _reSolarPhotovoltaic_extraInitializers);
            __esDecorate(null, null, _reWind_decorators, { kind: "field", name: "reWind", static: false, private: false, access: { has: function (obj) { return "reWind" in obj; }, get: function (obj) { return obj.reWind; }, set: function (obj, value) { obj.reWind = value; } }, metadata: _metadata }, _reWind_initializers, _reWind_extraInitializers);
            __esDecorate(null, null, _reBiomass_decorators, { kind: "field", name: "reBiomass", static: false, private: false, access: { has: function (obj) { return "reBiomass" in obj; }, get: function (obj) { return obj.reBiomass; }, set: function (obj, value) { obj.reBiomass = value; } }, metadata: _metadata }, _reBiomass_initializers, _reBiomass_extraInitializers);
            __esDecorate(null, null, _reSolarThermal_decorators, { kind: "field", name: "reSolarThermal", static: false, private: false, access: { has: function (obj) { return "reSolarThermal" in obj; }, get: function (obj) { return obj.reSolarThermal; }, set: function (obj, value) { obj.reSolarThermal = value; } }, metadata: _metadata }, _reSolarThermal_initializers, _reSolarThermal_extraInitializers);
            __esDecorate(null, null, _reOthersUnit_decorators, { kind: "field", name: "reOthersUnit", static: false, private: false, access: { has: function (obj) { return "reOthersUnit" in obj; }, get: function (obj) { return obj.reOthersUnit; }, set: function (obj, value) { obj.reOthersUnit = value; } }, metadata: _metadata }, _reOthersUnit_initializers, _reOthersUnit_extraInitializers);
            __esDecorate(null, null, _reOthers_decorators, { kind: "field", name: "reOthers", static: false, private: false, access: { has: function (obj) { return "reOthers" in obj; }, get: function (obj) { return obj.reOthers; }, set: function (obj, value) { obj.reOthers = value; } }, metadata: _metadata }, _reOthers_initializers, _reOthers_extraInitializers);
            __esDecorate(null, null, _offsiteRenewablePower_decorators, { kind: "field", name: "offsiteRenewablePower", static: false, private: false, access: { has: function (obj) { return "offsiteRenewablePower" in obj; }, get: function (obj) { return obj.offsiteRenewablePower; }, set: function (obj, value) { obj.offsiteRenewablePower = value; } }, metadata: _metadata }, _offsiteRenewablePower_initializers, _offsiteRenewablePower_extraInitializers);
            __esDecorate(null, null, _processMpManufacturingUnitStatus_decorators, { kind: "field", name: "processMpManufacturingUnitStatus", static: false, private: false, access: { has: function (obj) { return "processMpManufacturingUnitStatus" in obj; }, get: function (obj) { return obj.processMpManufacturingUnitStatus; }, set: function (obj, value) { obj.processMpManufacturingUnitStatus = value; } }, metadata: _metadata }, _processMpManufacturingUnitStatus_initializers, _processMpManufacturingUnitStatus_extraInitializers);
            __esDecorate(null, null, _calculateBulkSec_decorators, { kind: "field", name: "calculateBulkSec", static: false, private: false, access: { has: function (obj) { return "calculateBulkSec" in obj; }, get: function (obj) { return obj.calculateBulkSec; }, set: function (obj, value) { obj.calculateBulkSec = value; } }, metadata: _metadata }, _calculateBulkSec_initializers, _calculateBulkSec_extraInitializers);
            __esDecorate(null, null, _calculateBulkSwc_decorators, { kind: "field", name: "calculateBulkSwc", static: false, private: false, access: { has: function (obj) { return "calculateBulkSwc" in obj; }, get: function (obj) { return obj.calculateBulkSwc; }, set: function (obj, value) { obj.calculateBulkSwc = value; } }, metadata: _metadata }, _calculateBulkSwc_initializers, _calculateBulkSwc_extraInitializers);
            __esDecorate(null, null, _calculateBulkStec_decorators, { kind: "field", name: "calculateBulkStec", static: false, private: false, access: { has: function (obj) { return "calculateBulkStec" in obj; }, get: function (obj) { return obj.calculateBulkStec; }, set: function (obj, value) { obj.calculateBulkStec = value; } }, metadata: _metadata }, _calculateBulkStec_initializers, _calculateBulkStec_extraInitializers);
            __esDecorate(null, null, _calculateBulkSecMultipled_decorators, { kind: "field", name: "calculateBulkSecMultipled", static: false, private: false, access: { has: function (obj) { return "calculateBulkSecMultipled" in obj; }, get: function (obj) { return obj.calculateBulkSecMultipled; }, set: function (obj, value) { obj.calculateBulkSecMultipled = value; } }, metadata: _metadata }, _calculateBulkSecMultipled_initializers, _calculateBulkSecMultipled_extraInitializers);
            __esDecorate(null, null, _calculateBulkSwcMultipled_decorators, { kind: "field", name: "calculateBulkSwcMultipled", static: false, private: false, access: { has: function (obj) { return "calculateBulkSwcMultipled" in obj; }, get: function (obj) { return obj.calculateBulkSwcMultipled; }, set: function (obj, value) { obj.calculateBulkSwcMultipled = value; } }, metadata: _metadata }, _calculateBulkSwcMultipled_initializers, _calculateBulkSwcMultipled_extraInitializers);
            __esDecorate(null, null, _calculateBulkTecMultipled_decorators, { kind: "field", name: "calculateBulkTecMultipled", static: false, private: false, access: { has: function (obj) { return "calculateBulkTecMultipled" in obj; }, get: function (obj) { return obj.calculateBulkTecMultipled; }, set: function (obj, value) { obj.calculateBulkTecMultipled = value; } }, metadata: _metadata }, _calculateBulkTecMultipled_initializers, _calculateBulkTecMultipled_extraInitializers);
            __esDecorate(null, null, _calculateBulkStecMultipled_decorators, { kind: "field", name: "calculateBulkStecMultipled", static: false, private: false, access: { has: function (obj) { return "calculateBulkStecMultipled" in obj; }, get: function (obj) { return obj.calculateBulkStecMultipled; }, set: function (obj, value) { obj.calculateBulkStecMultipled = value; } }, metadata: _metadata }, _calculateBulkStecMultipled_initializers, _calculateBulkStecMultipled_extraInitializers);
            __esDecorate(null, null, _measuresImplementedMpUnits_decorators, { kind: "field", name: "measuresImplementedMpUnits", static: false, private: false, access: { has: function (obj) { return "measuresImplementedMpUnits" in obj; }, get: function (obj) { return obj.measuresImplementedMpUnits; }, set: function (obj, value) { obj.measuresImplementedMpUnits = value; } }, metadata: _metadata }, _measuresImplementedMpUnits_initializers, _measuresImplementedMpUnits_extraInitializers);
            __esDecorate(null, null, _detailsOfRainWaterHarvestingMpUnits_decorators, { kind: "field", name: "detailsOfRainWaterHarvestingMpUnits", static: false, private: false, access: { has: function (obj) { return "detailsOfRainWaterHarvestingMpUnits" in obj; }, get: function (obj) { return obj.detailsOfRainWaterHarvestingMpUnits; }, set: function (obj, value) { obj.detailsOfRainWaterHarvestingMpUnits = value; } }, metadata: _metadata }, _detailsOfRainWaterHarvestingMpUnits_initializers, _detailsOfRainWaterHarvestingMpUnits_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateProcessMpManufacturingUnitDto = CreateProcessMpManufacturingUnitDto;
