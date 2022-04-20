"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const message_schema_1 = require("../../schemas/message.schema");
let MessagesService = class MessagesService {
    constructor(model) {
        this.model = model;
    }
    async getMessages(userId, query, page) {
        const PER_PAGE = 30;
        if (!query) {
            throw new common_1.BadRequestException('Укажите текст сообщения');
        }
        let result = await this.model
            .find({ content: { $regex: query, $options: 'i' } })
            .skip(page * PER_PAGE)
            .limit(PER_PAGE)
            .populate('sender', 'name surname avatar')
            .populate({
            path: 'chat',
            select: 'users',
        })
            .select('-__v');
        const isLastPage = result.length === 0;
        return {
            isLastPage,
            messages: result.filter((message) => message.chat.users.some((uId) => uId.toString() === userId.toString())),
        };
    }
};
MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(message_schema_1.Message.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MessagesService);
exports.MessagesService = MessagesService;
//# sourceMappingURL=messages.service.js.map