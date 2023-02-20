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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const scheduleModel_1 = __importDefault(require("../models/scheduleModel"));
class ScheduleController {
    static getAllSchedules(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield scheduleModel_1.default.find({}, (err, result) => {
                if (!err) {
                    res.send(result);
                }
                else {
                    throw err;
                }
            })
                .clone()
                .catch((err) => console.log(err));
        });
    }
    static getScheduleById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const user = yield scheduleModel_1.default.findById(id);
            res.json(user);
        });
    }
    static getScheduleByToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_ID = req.user.data._id;
            const user = yield scheduleModel_1.default.find({ user_id: user_ID }, (err, found) => {
                if (!err) {
                    return found;
                }
                else {
                    throw err;
                }
            })
                .clone()
                .catch((err) => console.log(err));
            res.json(user);
        });
    }
}
exports.default = ScheduleController;
