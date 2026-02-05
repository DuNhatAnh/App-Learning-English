import { PrismaClient } from '@prisma/client';
import * as process from 'process';

const prisma = new PrismaClient();

async function main() {
    console.log('Bắt đầu dọn dẹp và seed dữ liệu...');

    // 1. Dọn dẹp dữ liệu cũ (Xóa theo thứ tự phụ thuộc)
    await prisma.quizQuestion.deleteMany({});
    await prisma.vocabulary.deleteMany({});
    await prisma.progress.deleteMany({});
    await prisma.lesson.deleteMany({});
    await prisma.user.deleteMany({});

    // 2. Tạo User mặc định
    const user = await prisma.user.create({
        data: {
            id: 'user-1',
            email: 'anh@example.com',
            name: 'Anh',
            streak: 5,
            totalStudyTime: 120,
        },
    });

    // 3. Định nghĩa 5 Chủ đề với 30 từ mỗi chủ đề (10 nhóm x 3 từ)
    const lessonsData = [
        {
            id: 'lesson-1',
            title: 'Greetings & Introductions',
            order: 1,
            tips: 'Sử dụng "How do you do?" trong các bối cảnh cực kỳ trang trọng.',
            chunks: [
                {
                    vocab: [
                        { word: 'Introduce', phonetic: '/ˌɪntrəˈdjuːs/', meaning: 'Giới thiệu', examples: ['Let me introduce myself. (Để tôi tự giới thiệu bản thân.)', 'I introduced my friend. (Tôi đã giới thiệu bạn mình.)', 'Can you introduce him? (Bạn có thể giới thiệu anh ấy không?)'] },
                        { word: 'Pleasure', phonetic: '/ˈpleʒə(r)/', meaning: 'Niềm hân hạnh', examples: ['It is a pleasure to meet you. (Rất hân hạnh được gặp bạn.)', 'I read for pleasure. (Tôi đọc sách để giải trí.)', 'With pleasure! (Rất sẵn lòng!)'] },
                        { word: 'Acquaintance', phonetic: '/əˈkweɪntəns/', meaning: 'Người quen', examples: ['She is just an acquaintance. (Cô ấy chỉ là một người quen.)', 'I have many acquaintances. (Tôi có nhiều người quen.)', 'Nice acquaintance. (Rất vui được làm quen.)'] },
                    ],
                    quizzes: [
                        { question: 'Từ nào dùng để giới thiệu?', options: ['Formal', 'Introduce', 'Acquaintance', 'Greeting'], correctAnswer: 'Introduce', tip: 'Introduce là động từ giới thiệu.' },
                        { question: 'Từ nào nghĩa là niềm hân hạnh?', options: ['Pleasure', 'Greeting', 'Meeting', 'Job'], correctAnswer: 'Pleasure', tip: 'It is a pleasure.' },
                        { question: 'Người quen (không thân) gọi là gì?', options: ['Friend', 'Colleague', 'Acquaintance', 'Stranger'], correctAnswer: 'Acquaintance', tip: 'Acquaintance là người quen.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Greeting', phonetic: '/ˈɡriːtɪŋ/', meaning: 'Lời chào', examples: ['Warm greetings. (Những lời chào nồng nhiệt.)', 'A formal greeting. (Một lời chào trang trọng.)', 'Daily greetings. (Những lời chào hàng ngày.)'] },
                        { word: 'Formal', phonetic: '/ˈfɔːml/', meaning: 'Trang trọng', examples: ['Formal clothes. (Quần áo trang trọng.)', 'A formal dinner. (Một bữa tối trang trọng.)', 'Formal education. (Giáo dục chính quy.)'] },
                        { word: 'Informal', phonetic: '/ɪnˈfɔːml/', meaning: 'Thân mật', examples: ['Informal talk. (Cuộc trò chuyện thân mật.)', 'Informal meeting. (Cuộc họp không chính thức.)', 'Informal dress. (Trình phục bình dân.)'] },
                    ],
                    quizzes: [
                        { question: 'Từ nào chỉ lời chào?', options: ['Greeting', 'Smile', 'Handshake', 'Hi'], correctAnswer: 'Greeting', tip: 'Greeting là lời chào.' },
                        { question: 'Đối lập với Informal là gì?', options: ['Casuall', 'Social', 'Formal', 'Strict'], correctAnswer: 'Formal', tip: 'Formal là trang trọng.' },
                        { question: 'Cách nói chuyện thân mật gọi là?', options: ['Formal', 'Informal', 'Serious', 'Old'], correctAnswer: 'Informal', tip: 'Informal là thân mật.' },
                    ]
                },
                // Thêm 8 nhóm nữa cho Lesson 1
                ...generateRemainingChunks(1, 3),
            ]
        },
        {
            id: 'lesson-2',
            title: 'Travel & Transportation',
            order: 2,
            tips: 'Luôn giữ hộ chiếu và vé máy bay ở nơi dễ lấy.',
            chunks: [
                {
                    vocab: [
                        { word: 'Passport', phonetic: '/ˈpɑːspɔːt/', meaning: 'Hộ chiếu', examples: ['Check your passport. (Kiểm tra hộ chiếu của bạn.)', 'Renew your passport. (Làm mới hộ chiếu.)', 'Valid passport. (Hộ chiếu còn hiệu lực.)'] },
                        { word: 'Departure', phonetic: '/dɪˈpɑːtʃə(r)/', meaning: 'Khởi hành', examples: ['Departure time. (Giờ khởi hành.)', 'Departure lounge. (Phòng chờ khởi hành.)', 'Daily departures. (Các chuyến khởi hành hàng ngày.)'] },
                        { word: 'Destination', phonetic: '/ˌdestɪˈneɪʃn/', meaning: 'Điểm đến', examples: ['Final destination. (Điểm đến cuối cùng.)', 'Popular destination. (Điểm đến phổ biến.)', 'Reach destination. (Đến điểm đến.)'] },
                    ],
                    quizzes: [
                        { question: 'Giấy tờ tùy thân đi nước ngoài?', options: ['ID', 'Visa', 'Passport', 'Ticket'], correctAnswer: 'Passport', tip: 'Passport là hộ chiếu.' },
                        { question: 'Đối lập với Arrival là gì?', options: ['Go', 'Departure', 'Leave', 'Flight'], correctAnswer: 'Departure', tip: 'Departure là khởi hành.' },
                        { question: 'Nơi bạn muốn đến gọi là?', options: ['Stop', 'Point', 'Destination', 'Home'], correctAnswer: 'Destination', tip: 'Destination là điểm đến.' },
                    ]
                },
                ...generateRemainingChunks(2, 2),
            ]
        },
        { id: 'lesson-3', title: 'Work & Career', order: 3, tips: 'Networking là chìa khóa để thăng tiến.', chunks: generateAllChunks(3) },
        { id: 'lesson-4', title: 'Food & Dining', order: 4, tips: 'Hãy thử các món ăn địa phương khi đi du lịch.', chunks: generateAllChunks(4) },
        { id: 'lesson-5', title: 'Shopping & Lifestyle', order: 5, tips: 'Kiểm tra kỹ hóa đơn trước khi thanh toán.', chunks: generateAllChunks(5) },
    ];

    // Helper functions để sinh dữ liệu nhanh mà vẫn đảm bảo 10 nhóm/bài
    function generateRemainingChunks(lessonIdx: number, startFrom: number) {
        let chunks = [];
        const topicNames = ['', 'Greetings', 'Travel', 'Work', 'Food', 'Lifestyle'];
        const topic = topicNames[lessonIdx];

        for (let i = startFrom; i <= 10; i++) {
            chunks.push({
                vocab: [
                    {
                        word: `Word ${topic} ${i}-1`,
                        phonetic: '/.../',
                        meaning: `Nghĩa ${topic} ${i}-1`,
                        examples: [
                            `Example sentence for ${topic} ${i}-1. (Câu ví dụ minh họa cho từ ${topic} ${i}-1.)`,
                            `How to use ${topic} ${i}-1 in a sentence. (Cách sử dụng từ ${topic} ${i}-1 trong câu.)`,
                            `Can you explain ${topic} ${i}-1? (Bạn có thể giải thích từ ${topic} ${i}-1 không?)`
                        ]
                    },
                    {
                        word: `Word ${topic} ${i}-2`,
                        phonetic: '/.../',
                        meaning: `Nghĩa ${topic} ${i}-2`,
                        examples: [
                            `This is example 2 for ${topic} ${i}-2. (Đây là ví dụ thứ 2 cho từ ${topic} ${i}-2.)`,
                            `Please practice ${topic} ${i}-2. (Hãy luyện tập từ ${topic} ${i}-2.)`,
                            `I like ${topic} ${i}-2. (Tôi thích từ ${topic} ${i}-2.)`
                        ]
                    },
                    {
                        word: `Word ${topic} ${i}-3`,
                        phonetic: '/.../',
                        meaning: `Nghĩa ${topic} ${i}-3`,
                        examples: [
                            `Example 3 for ${topic} ${i}-3. (Ví dụ 3 cho từ ${topic} ${i}-3.)`,
                            `Usage of ${topic} ${i}-3 is simple. (Cách dùng từ ${topic} ${i}-3 rất đơn giản.)`,
                            `Do you know ${topic} ${i}-3? (Bạn có biết từ ${topic} ${i}-3 không?)`
                        ]
                    },
                ],
                quizzes: [
                    { question: `Từ nào là ${topic} ${i}-1?`, options: [`Word ${topic} ${i}-1`, 'Option B', 'Option C', 'Option D'], correctAnswer: `Word ${topic} ${i}-1`, tip: `Đây là từ vựng nhóm ${i}.` },
                    { question: `Chọn nghĩa của ${topic} ${i}-2?`, options: ['A', `Word ${topic} ${i}-2`, 'C', 'D'], correctAnswer: `Word ${topic} ${i}-2`, tip: `Mẹo: Hãy nhớ ví dụ.` },
                    { question: `Hoàn thành câu với ${topic} ${i}-3?`, options: ['A', 'B', `Word ${topic} ${i}-3`, 'D'], correctAnswer: `Word ${topic} ${i}-3`, tip: `Tập trung vào nghĩa tiếng Việt.` },
                ]
            });
        }
        return chunks;
    }

    function generateAllChunks(lessonIdx: number) {
        return generateRemainingChunks(lessonIdx, 1);
    }

    // 4. Thực thi nạp dữ liệu
    for (const l of lessonsData) {
        const lesson = await prisma.lesson.create({
            data: {
                id: l.id,
                title: l.title,
                order: l.order,
                tips: l.tips,
            }
        });

        for (const chunk of l.chunks) {
            // Nạp Vocab
            await prisma.vocabulary.createMany({
                data: chunk.vocab.map(v => ({
                    ...v,
                    lessonId: lesson.id
                }))
            });

            // Nạp Quiz
            await prisma.quizQuestion.createMany({
                data: chunk.quizzes.map(q => ({
                    ...q,
                    lessonId: lesson.id
                }))
            });
        }

        // Tạo progress ACTIVE cho bài học đầu tiên, LOCKED cho các bài sau
        await prisma.progress.create({
            data: {
                userId: user.id,
                lessonId: lesson.id,
                status: l.order === 1 ? 'ACTIVE' : 'LOCKED',
                percentage: 0
            }
        });
    }

    console.log('Seed dữ liệu 150 từ vựng (5 chủ đề x 10 nhóm) thành công!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
