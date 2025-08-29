"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingModule = void 0;
const common_1 = require("@nestjs/common");
const billing_controller_1 = require("./billing.controller");
const billing_webhook_controller_1 = require("./billing-webhook.controller");
const billing_cron_controller_1 = require("./billing-cron.controller");
const wompi_service_1 = require("./wompi.service");
let BillingModule = class BillingModule {
};
exports.BillingModule = BillingModule;
exports.BillingModule = BillingModule = __decorate([
    (0, common_1.Module)({
        controllers: [billing_controller_1.BillingController, billing_webhook_controller_1.BillingWebhookController, billing_cron_controller_1.BillingCronController],
        providers: [wompi_service_1.WompiService],
        exports: [wompi_service_1.WompiService],
    })
], BillingModule);
//# sourceMappingURL=billing.module.js.map