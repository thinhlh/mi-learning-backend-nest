"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserDto = void 0;
const openapi = require("@nestjs/swagger");
class CreateUserDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, password: { required: true, type: () => String }, email: { required: true, type: () => String }, occupation: { required: true, type: () => String }, birthday: { required: true, type: () => Number }, avatar: { required: true, type: () => String }, role: { required: true, enum: require("../../role/role").Role } };
    }
}
exports.CreateUserDto = CreateUserDto;
//# sourceMappingURL=create-user.dto.js.map