const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

const cors = require('cors')
app.use(cors())

// 포트 설정
const PORT = 4000;

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일 제공

// OpenAI API 키 설정
const OPENAI_API_KEY = ''; 

// 비동기 응답 생성 함수 (Chat Completion API 사용)
async function generateResponse(inputText) {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',   // 사용할 모델
                messages: [
                    { role: 'user', content: inputText }  // 사용자의 입력 메시지
                ],
                max_tokens: 50,           // 생성할 최대 토큰 수
                temperature: 0.99         // 창의성 설정
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.choices[0].message.content;  // 응답 메시지 내용 반환
    } catch (error) {
        console.error('API 오류:', error.response ? error.response.data : error.message);
        return `오류: ${error.response ? error.response.data.error.message : error.message}`;
    }
}

// 메인 페이지 라우팅
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// POST 요청 처리
app.post('/ask', async (req, res) => {
    const userInput = req.body.question;
    const response = await generateResponse(userInput);
    res.send(response);
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
