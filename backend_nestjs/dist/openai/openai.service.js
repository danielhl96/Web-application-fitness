"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "OpenaiService", {
    enumerable: true,
    get: function() {
        return OpenaiService;
    }
});
const _common = require("@nestjs/common");
const _openai = /*#__PURE__*/ _interop_require_default(require("openai"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {
        __proto__: null
    };
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
let OpenaiService = class OpenaiService {
    async analyzeFoodText(text) {
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: 'Analyze the food described in the following text and estimate its nutritional content. ' + `Text: "${text}". ` + 'Return the result as a compact JSON object with the following keys: name (short meal name), calories (kcal), protein (g), carbs (g), fats (g). ' + 'Example: {"name": "Chicken Salad", "calories": 420, "protein": 32, "carbs": 18, "fats": 12}. ' + 'Do not add any explanation, only the JSON.'
                }
            ]
        });
        const content = response.choices[0].message.content ?? '';
        const json = content.match(/\{.*\}/s)?.[0];
        return json ? JSON.parse(json) : null;
    }
    async analyzeFoodImage(prompt, imageFile) {
        if (!imageFile) throw new Error('No image file provided');
        const base64 = imageFile.buffer.toString('base64');
        const mimeType = imageFile.mimetype;
        console.log('Prompt for AI analysis:', prompt);
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:${mimeType};base64,${base64}`
                            }
                        },
                        {
                            type: 'text',
                            text: 'Analyze the food in the image and estimate its nutritional content.' + (prompt ? ` The user provided the following additional context, use it to improve your estimate: "${prompt}".` : '') + ' Return the result as a compact JSON object with the following keys: name (short meal name), calories (kcal), protein (g), carbs (g), fats (g). Example: {"name": "Chicken Salad", "calories": 420, "protein": 32, "carbs": 18, "fats": 12}. Do not add any explanation, only the JSON.'
                        }
                    ]
                }
            ]
        });
        const content = response.choices[0].message.content ?? '';
        const json = content.match(/\{.*\}/s)?.[0];
        return json ? JSON.parse(json) : null;
    }
    async aiCoach(question, history) {
        console.log('Received question for AI Coach:', question);
        const messages = [
            {
                role: 'system',
                content: 'You are an AI Coach for Fitness and Sports. Answer only questions related to athletic topics like training, nutrition, motivation, and health. If the question is not athletic, politely respond that you only answer athletic questions. You can respond in English or German, but primarily in English. Answer concisely and informatively and shortly.'
            },
            ...history.map((h)=>({
                    role: h.isUser ? 'user' : 'assistant',
                    content: h.message
                })),
            question ? {
                role: 'user',
                content: question
            } : null
        ].filter(Boolean);
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o',
            messages
        });
        return response.choices[0].message.content ?? '';
    }
    async speechToText(audioBuffer, mimeType) {
        const { toFile } = await Promise.resolve().then(()=>/*#__PURE__*/ _interop_require_wildcard(require("openai")));
        const baseType = mimeType.split(';')[0].trim();
        const ext = baseType.includes('webm') ? 'webm' : baseType.includes('ogg') ? 'ogg' : baseType.includes('mp4') || baseType.includes('m4a') ? 'mp4' : baseType.includes('mpeg') || baseType.includes('mp3') ? 'mp3' : baseType.includes('wav') ? 'wav' : 'webm';
        const file = await toFile(audioBuffer, `audio.${ext}`, {
            type: baseType
        });
        const transcription = await this.openai.audio.transcriptions.create({
            file,
            model: 'whisper-1'
        });
        return transcription.text;
    }
    constructor(){
        this.openai = new _openai.default({
            apiKey: process.env.OPENAI_API_KEY
        });
    }
};
OpenaiService = _ts_decorate([
    (0, _common.Injectable)()
], OpenaiService);
