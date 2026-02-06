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
                {
                    vocab: [
                        { word: 'Polite', phonetic: '/pəˈlaɪt/', meaning: 'Lịch sự', examples: ['Be polite to others. (Hãy lịch sự với người khác.)', 'A polite request. (Một yêu cầu lịch sự.)', 'Manners are polite. (Cách cư xử rất lịch sự.)'] },
                        { word: 'Handshake', phonetic: '/ˈhændʃeɪk/', meaning: 'Cái bắt tay', examples: ['A firm handshake. (Một cái bắt tay chắc chắn.)', 'Exchange handshakes. (Trao đổi cái bắt tay.)', 'Friendly handshake. (Cái bắt tay thân thiện.)'] },
                        { word: 'Relationship', phonetic: '/rɪˈleɪʃnʃɪp/', meaning: 'Mối quan hệ', examples: ['A close relationship. (Một mối quan hệ thân thiết.)', 'Long-term relationship. (Mối quan hệ lâu dài.)', 'Building relationships. (Xây dựng các mối quan hệ.)'] },
                    ],
                    quizzes: [
                        { question: 'Cử chỉ khi gặp nhau lần đầu?', options: ['Winking', 'Handshake', 'Singing', 'Running'], correctAnswer: 'Handshake', tip: 'Handshake là bắt tay.' },
                        { question: 'Trái nghĩa với "rude" là gì?', options: ['Polite', 'Angry', 'Sad', 'Fast'], correctAnswer: 'Polite', tip: 'Polite là lịch sự.' },
                        { question: 'Mối liên kết giữa 2 người gọi là?', options: ['Space', 'Distance', 'Relationship', 'Wall'], correctAnswer: 'Relationship', tip: 'Relationship là mối quan hệ.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Meeting', phonetic: '/ˈmiːtɪŋ/', meaning: 'Cuộc gặp gỡ', examples: ['A business meeting. (Một cuộc họp kinh doanh.)', 'I have a meeting at 9. (Tôi có cuộc họp lúc 9 giờ.)', 'Important meeting. (Cuộc họp quan trọng.)'] },
                        { word: 'Welcome', phonetic: '/ˈwelkəm/', meaning: 'Chào mừng', examples: ['Welcome home! (Chào mừng về nhà!)', 'You are welcome. (Không có chi.)', 'Warm welcome. (Sự chào đón nồng nhiệt.)'] },
                        { word: 'Invitation', phonetic: '/ˌɪnvɪˈteɪʃn/', meaning: 'Lời mời', examples: ['Accept an invitation. (Chấp nhận một lời mời.)', 'Send an invitation. (Gửi một lời mời.)', 'A wedding invitation. (Một lời mời đám cưới.)'] },
                    ],
                    quizzes: [
                        { question: 'Từ nào nghĩa là "chào mừng"?', options: ['Go', 'Bye', 'Welcome', 'Stay'], correctAnswer: 'Welcome', tip: 'Welcome là chào mừng.' },
                        { question: 'Khi bạn muốn mời ai đó, bạn gửi một...?', options: ['Bill', 'Invitation', 'Letter', 'Box'], correctAnswer: 'Invitation', tip: 'Invitation là lời mời.' },
                        { question: 'Sự kiện nhiều người tụ họp gọi là?', options: ['Meeting', 'Single', 'Sleep', 'Alone'], correctAnswer: 'Meeting', tip: 'Meeting là cuộc gặp.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Situation', phonetic: '/ˌsɪtʃuˈeɪʃn/', meaning: 'Tình huống', examples: ['Difficult situation. (Tình huống khó khăn.)', 'Explain the situation. (Giải thích tình huống.)', 'Social situation. (Tình huống xã hội.)'] },
                        { word: 'Culture', phonetic: '/ˈkʌltʃə(r)/', meaning: 'Văn hóa', examples: ['Different cultures. (Các nền văn hóa khác nhau.)', 'Traditional culture. (Văn hóa truyền thống.)', 'Culture shock. (Sốc văn hóa.)'] },
                        { word: 'Tradition', phonetic: '/trəˈdɪʃn/', meaning: 'Truyền thống', examples: ['Follow tradition. (Theo truyền thống.)', 'A family tradition. (Một truyền thống gia đình.)', 'Long tradition. (Truyền thống lâu đời.)'] },
                    ],
                    quizzes: [
                        { question: 'Phong tục được truyền lại qua các thế hệ gọi là?', options: ['Trend', 'Tradition', 'Style', 'Game'], correctAnswer: 'Tradition', tip: 'Tradition là truyền thống.' },
                        { question: 'Văn hóa tiếng Anh là gì?', options: ['Food', 'Sports', 'Culture', 'News'], correctAnswer: 'Culture', tip: 'Culture là văn hóa.' },
                        { question: 'Hoàn cảnh đang diễn ra gọi là?', options: ['Situation', 'End', 'Start', 'Point'], correctAnswer: 'Situation', tip: 'Situation là tình huống.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Respect', phonetic: '/rɪˈspekt/', meaning: 'Sự tôn trọng', examples: ['Show respect. (Thể hiện sự tôn trọng.)', 'Respect older people. (Tôn trọng người lớn tuổi.)', 'Mutual respect. (Sự tôn trọng lẫn nhau.)'] },
                        { word: 'Behavior', phonetic: '/bɪˈheɪvjə(r)/', meaning: 'Hành vi', examples: ['Good behavior. (Hành vi tốt.)', 'Social behavior. (Hành vi xã hội.)', 'Analyze behavior. (Phân tích hành vi.)'] },
                        { word: 'Social', phonetic: '/ˈsəʊʃl/', meaning: 'Xã hội', examples: ['Social skills. (Kỹ năng xã hội.)', 'Social life. (Đời sống xã hội.)', 'Social media. (Mạng xã hội.)'] },
                    ],
                    quizzes: [
                        { question: 'Giao tiếp xã hội dùng từ nào?', options: ['Single', 'Alone', 'Social', 'Private'], correctAnswer: 'Social', tip: 'Social là xã hội.' },
                        { question: 'Cách cư xử gọi là gì?', options: ['Behavior', 'Cloth', 'Hair', 'Face'], correctAnswer: 'Behavior', tip: 'Behavior là hành vi.' },
                        { question: 'Thái độ trân trọng người khác gọi là?', options: ['Hate', 'Respect', 'Anger', 'Fear'], correctAnswer: 'Respect', tip: 'Respect là tôn trọng.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Contact', phonetic: '/ˈkɒntækt/', meaning: 'Liên lạc', examples: ['Keep in contact. (Giữ liên lạc.)', 'Lose contact. (Mất liên lạc.)', 'Eye contact. (Giao tiếp bằng mắt.)'] },
                        { word: 'Address', phonetic: '/əˈdres/', meaning: 'Địa chỉ', examples: ['Residential address. (Địa chỉ cư trú.)', 'Email address. (Địa chỉ email.)', 'What is your address? (Địa chỉ của bạn là gì?)'] },
                        { word: 'Friendship', phonetic: '/ˈfrendʃɪp/', meaning: 'Tình bạn', examples: ['Build a friendship. (Xây dựng tình bạn.)', 'Deep friendship. (Tình bạn sâu đậm.)', 'Value friendship. (Trân trọng tình bạn.)'] },
                    ],
                    quizzes: [
                        { question: 'Nơi ở của một người gọi là?', options: ['Work', 'School', 'Address', 'Store'], correctAnswer: 'Address', tip: 'Address là địa chỉ.' },
                        { question: 'Sát mặt khi gặp gỡ gọi là "eye...?', options: ['Foot', 'Hand', 'Contact', 'Ear'], correctAnswer: 'Contact', tip: 'Eye contact là giao tiếp bằng mắt.' },
                        { question: 'Mối quan hệ bạn bè gọi là?', options: ['Enemy', 'Friendship', 'War', 'Fight'], correctAnswer: 'Friendship', tip: 'Friendship là tình bạn.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Conversation', phonetic: '/ˌkɒnvəˈseɪʃn/', meaning: 'Cuộc trò chuyện', examples: ['Start a conversation. (Bắt đầu một cuộc trò chuyện.)', 'Private conversation. (Cuộc trò chuyện riêng tư.)', 'Everyday conversation. (Trò chuyện hàng ngày.)'] },
                        { word: 'Topic', phonetic: '/ˈtɒpɪk/', meaning: 'Chủ đề', examples: ['Choose a topic. (Chọn một chủ đề.)', 'Interesting topic. (Chủ đề thú vị.)', 'Main topic. (Chủ đề chính.)'] },
                        { word: 'Interest', phonetic: '/ˈɪntrest/', meaning: 'Sự quan tâm', examples: ['Common interests. (Sở thích chung.)', 'Show interest. (Thể hiện sự quan tâm.)', 'Lack of interest. (Thiếu sự quan tâm.)'] },
                    ],
                    quizzes: [
                        { question: 'Nói chuyện phiếm gọi là?', options: ['Conversation', 'Sleeping', 'Eating', 'Running'], correctAnswer: 'Conversation', tip: 'Conversation là trò chuyện.' },
                        { question: 'Đề tài thảo luận gọi là gì?', options: ['Pen', 'Topic', 'Cup', 'Car'], correctAnswer: 'Topic', tip: 'Topic là chủ đề.' },
                        { question: 'Thứ bạn thích làm lúc rảnh rỗi?', options: ['Task', 'Work', 'Interest', 'Pain'], correctAnswer: 'Interest', tip: 'Interest là sở thích.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Background', phonetic: '/ˈbækɡraʊnd/', meaning: 'Lý lịch/Nền tảng', examples: ['Family background. (Hoàn cảnh gia đình.)', 'Educational background. (Nền tảng giáo dục.)', 'In the background. (Phía sau hậu trường.)'] },
                        { word: 'Neighborhood', phonetic: '/ˈneɪbəhʊd/', meaning: 'Khu xóm', examples: ['A quiet neighborhood. (Khu phố yên tĩnh.)', 'Friendly neighborhood. (Khu phố thân thiện.)', 'New neighborhood. (Khu phố mới.)'] },
                        { word: 'Community', phonetic: '/kəˈmjuːnəti/', meaning: 'Cộng đồng', examples: ['Local community. (Cộng đồng địa phương.)', 'International community. (Cộng đồng quốc tế.)', 'Sense of community. (Ý thức cộng đồng.)'] },
                    ],
                    quizzes: [
                        { question: 'Tập hợp người sống cùng khu vực?', options: ['Single', 'Alone', 'Community', 'Private'], correctAnswer: 'Community', tip: 'Community là cộng đồng.' },
                        { question: 'Hàng xóm xung quanh bạn gọi là?', options: ['Neighborhood', 'Space', 'Sky', 'Mountain'], correctAnswer: 'Neighborhood', tip: 'Neighborhood là khu xóm.' },
                        { question: 'Hoàn cảnh xuất thân của một người?', options: ['Front', 'Background', 'Side', 'Top'], correctAnswer: 'Background', tip: 'Background là nền tảng.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Relative', phonetic: '/ˈrelətɪv/', meaning: 'Họ hàng', examples: ['A distant relative. (Một người họ hàng xa.)', 'Visit relatives. (Thăm họ hàng.)', 'Close relatives. (Họ hàng gần.)'] },
                        { word: 'Communication', phonetic: '/kəˌmjuːnɪˈkeɪʃn/', meaning: 'Giao tiếp', examples: ['Effective communication. (Giao tiếp hiệu quả.)', 'Non-verbal communication. (Giao tiếp phi ngôn ngữ.)', 'Communication skills. (Kỹ năng giao tiếp.)'] },
                        { word: 'Interaction', phonetic: '/ˌɪntərˈækʃn/', meaning: 'Sự tương tác', examples: ['Human interaction. (Tương tác giữa người với người.)', 'Social interaction. (Tương tác xã hội.)', 'Frequent interaction. (Tương tác thường xuyên.)'] },
                    ],
                    quizzes: [
                        { question: 'Kỹ năng truyền đạt thông tin gọi là?', options: ['Singing', 'Communication', 'Eating', 'Driving'], correctAnswer: 'Communication', tip: 'Communication là giao tiếp.' },
                        { question: 'Người trong cùng gia đình lớn gọi là?', options: ['Relative', 'Stranger', 'Enemy', 'Pet'], correctAnswer: 'Relative', tip: 'Relative là họ hàng.' },
                        { question: 'Khả năng phối hợp giữa nhiều người?', options: ['Interaction', 'Fixed', 'Stay', 'Stop'], correctAnswer: 'Interaction', tip: 'Interaction là tương tác.' },
                    ]
                },
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
                {
                    vocab: [
                        { word: 'Journey', phonetic: '/ˈdʒɜːni/', meaning: 'Cuộc hành trình', examples: ['Start a journey. (Bắt đầu một hành trình.)', 'Safe journey! (Thượng lộ bình an!)', 'A long journey. (Một hành trình dài.)'] },
                        { word: 'Luggage', phonetic: '/ˈlʌɡɪdʒ/', meaning: 'Hành lý', examples: ['Pack your luggage. (Đóng gói hành lý.)', 'Lost luggage. (Hành lý thất lạc.)', 'Hand luggage. (Hành lý xách tay.)'] },
                        { word: 'Booking', phonetic: '/ˈbʊkɪŋ/', meaning: 'Sự đặt chỗ', examples: ['Make a booking. (Đặt phòng/chỗ.)', 'Confirm your booking. (Xác nhận đặt chỗ.)', 'Online booking. (Đặt chỗ trực tuyến.)'] },
                    ],
                    quizzes: [
                        { question: 'Túi xách và vali mang theo gọi là?', options: ['Book', 'Luggage', 'Food', 'Cloth'], correctAnswer: 'Luggage', tip: 'Luggage là hành lý.' },
                        { question: 'Việc đặt vé trước gọi là gì?', options: ['Cooking', 'Running', 'Booking', 'Crying'], correctAnswer: 'Booking', tip: 'Booking là đặt chỗ.' },
                        { question: 'Chuyến đi dài ngày gọi là?', options: ['Journey', 'Step', 'Stay', 'Rest'], correctAnswer: 'Journey', tip: 'Journey là hành trình.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Terminal', phonetic: '/ˈtɜːmɪnl/', meaning: 'Nhà ga (sân bay)', examples: ['International terminal. (Nhà ga quốc tế.)', 'Arrival terminal. (Nhà ga đến.)', 'Go to terminal 2. (Đi đến nhà ga số 2.)'] },
                        { word: 'Transit', phonetic: '/ˈtrænzɪt/', meaning: 'Quá cảnh', examples: ['In transit. (Đang trong quá trình vận chuyển/quá cảnh.)', 'Transit lounge. (Phòng chờ quá cảnh.)', 'Transit visa. (Visa quá cảnh.)'] },
                        { word: 'Connection', phonetic: '/kəˈnekʃn/', meaning: 'Chuyến bay nối chuyến', examples: ['Miss a connection. (Lỡ chuyến nối.)', 'Catch a connection. (Bắt chuyến nối.)', 'Tight connection. (Nối chuyến sát giờ.)'] },
                    ],
                    quizzes: [
                        { question: 'Dừng chân giữa chặng bay gọi là?', options: ['End', 'Transit', 'Stay', 'Home'], correctAnswer: 'Transit', tip: 'Transit là quá cảnh.' },
                        { question: 'Khu vực làm thủ tục tại sân bay?', options: ['School', 'Gym', 'Terminal', 'Shop'], correctAnswer: 'Terminal', tip: 'Terminal là nhà ga.' },
                        { question: 'Sự kết nối giữa các phương tiện gọi là?', options: ['Connection', 'Break', 'Gap', 'Single'], correctAnswer: 'Connection', tip: 'Connection là nối chuyến.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Schedule', phonetic: '/ˈʃedjuːl/', meaning: 'Lịch trình', examples: ['Check the schedule. (Kiểm tra lịch trình.)', 'On schedule. (Đúng lịch trình.)', 'Change of schedule. (Thay đổi lịch trình.)'] },
                        { word: 'Delay', phonetic: '/dɪˈleɪ/', meaning: 'Sự trễ/hoãn', examples: ['Unexpected delay. (Sự chậm trễ bất ngờ.)', 'Flight delay. (Chuyến bay bị hoãn.)', 'Sorry for the delay. (Xin lỗi vì sự chậm trễ.)'] },
                        { word: 'Cancellation', phonetic: '/ˌkænsəˈleɪʃn/', meaning: 'Sự hủy bỏ', examples: ['Hotel cancellation. (Hủy phòng khách sạn.)', 'Policy of cancellation. (Chính sách hủy bỏ.)', 'Mass cancellations. (Hủy hàng loạt.)'] },
                    ],
                    quizzes: [
                        { question: 'Khi chuyến bay không thực hiện nữa?', options: ['Delay', 'Move', 'Cancellation', 'Go'], correctAnswer: 'Cancellation', tip: 'Cancellation là hủy bỏ.' },
                        { question: 'Trái nghĩa với "early" là gì?', options: ['Delay', 'Fast', 'New', 'Clean'], correctAnswer: 'Delay', tip: 'Delay là chậm trễ.' },
                        { question: 'Thời gian biểu cụ thể gọi là?', options: ['Schedule', 'Empty', 'Free', 'Blank'], correctAnswer: 'Schedule', tip: 'Schedule là lịch trình.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Insurance', phonetic: '/ɪnˈʃʊərəns/', meaning: 'Bảo hiểm', examples: ['Travel insurance. (Bảo hiểm du lịch.)', 'Buy insurance. (Mua bảo hiểm.)', 'Insurance policy. (Hợp đồng bảo hiểm.)'] },
                        { word: 'Visa', phonetic: '/ˈviːzə/', meaning: 'Thị thực', examples: ['Apply for a visa. (Xin cấp visa.)', 'Tourist visa. (Visa du lịch.)', 'Valid visa. (Visa còn hạn.)'] },
                        { word: 'Check-in', phonetic: '/ˈtʃek ɪn/', meaning: 'Làm thủ tục', examples: ['Check-in counter. (Quầy làm thủ tục.)', 'Online check-in. (Làm thủ tục online.)', 'Check-in time. (Giờ làm thủ tục.)'] },
                    ],
                    quizzes: [
                        { question: 'Dịch vụ bảo vệ rủi ro khi đi xa?', options: ['Game', 'Insurance', 'Music', 'Sport'], correctAnswer: 'Insurance', tip: 'Insurance là bảo hiểm.' },
                        { question: 'Giấy phép vào một quốc gia?', options: ['Visa', 'Book', 'Paper', 'Ink'], correctAnswer: 'Visa', tip: 'Visa là thị thực.' },
                        { question: 'Bước đầu tiên khi đến sân bay/khách sạn?', options: ['Check-out', 'Check-in', 'Sleep', 'Eat'], correctAnswer: 'Check-in', tip: 'Check-in là làm thủ tục.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Boarding', phonetic: '/ˈbɔːdɪŋ/', meaning: 'Lên máy bay/tàu', examples: ['Boarding pass. (Thẻ lên máy bay.)', 'Start boarding. (Bắt đầu lên máy bay.)', 'Boarding gate. (Cửa lên máy bay.)'] },
                        { word: 'Passenger', phonetic: '/ˈpæsɪndʒə(r)/', meaning: 'Hành khách', examples: ['Train passenger. (Hành khách đi tàu.)', 'Passenger list. (Danh sách hành khách.)', 'Safe for passengers. (An toàn cho hành khách.)'] },
                        { word: 'Souvenir', phonetic: '/ˌsuːvəˈnɪə(r)/', meaning: 'Quà lưu niệm', examples: ['Buy souvenirs. (Mua quà lưu niệm.)', 'A souvenir from Japan. (Quà lưu niệm từ Nhật.)', 'Souvenir shop. (Cửa hàng quà lưu niệm.)'] },
                    ],
                    quizzes: [
                        { question: 'Người đi trên xe, tàu, máy máy?', options: ['Pilot', 'Driver', 'Passenger', 'Captain'], correctAnswer: 'Passenger', tip: 'Passenger là hành khách.' },
                        { question: 'Vật kỷ niệm chuyến đi gọi là?', options: ['Trash', 'Box', 'Souvenir', 'Stone'], correctAnswer: 'Souvenir', tip: 'Souvenir là quà lưu niệm.' },
                        { question: 'Thẻ dùng để lên máy bay gọi là...', options: ['Bank pass', 'Boarding pass', 'ID', 'Bill'], correctAnswer: 'Boarding pass', tip: 'Boarding pass là thẻ lên máy bay.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Sightseeing', phonetic: '/ˈsaɪtsiːɪŋ/', meaning: 'Tham quan', examples: ['Go sightseeing. (Đi tham quan.)', 'Sightseeing tour. (Chuyến tham quan.)', 'City sightseeing. (Tham quan thành phố.)'] },
                        { word: 'Guide', phonetic: '/ɡaɪd/', meaning: 'Hướng dẫn viên', examples: ['Tour guide. (Hướng dẫn viên du lịch.)', 'Travel guide. (Sách hướng dẫn.)', 'A local guide. (Hướng dẫn viên địa phương.)'] },
                        { word: 'Adventure', phonetic: '/ədˈventʃə(r)/', meaning: 'Cuộc phiêu lưu', examples: ['Seek adventure. (Tìm kiếm cuộc phiêu lưu.)', 'Real adventure. (Cuộc phiêu lưu thực thụ.)', 'Adventure sports. (Thể thao mạo hiểm.)'] },
                    ],
                    quizzes: [
                        { question: 'Người dẫn đoàn đi chơi gọi là?', options: ['Guide', 'Follower', 'Singer', 'Actor'], correctAnswer: 'Guide', tip: 'Guide là hướng dẫn viên.' },
                        { question: 'Trải nghiệm mới lạ và mạo hiểm?', options: ['Sleep', 'Rest', 'Adventure', 'Job'], correctAnswer: 'Adventure', tip: 'Adventure là phiêu lưu.' },
                        { question: 'Đi ngắm cảnh đẹp gọi là?', options: ['Sightseeing', 'Working', 'Reading', 'Inking'], correctAnswer: 'Sightseeing', tip: 'Sightseeing là tham quan.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Accommodation', phonetic: '/əˌkɒməˈdeɪʃn/', meaning: 'Chỗ ở (du lịch)', examples: ['Book accommodation. (Đặt chỗ ở.)', 'Cheap accommodation. (Chỗ ở giá rẻ.)', 'Luxury accommodation. (Chỗ ở sang trọng.)'] },
                        { word: 'Reservation', phonetic: '/ˌrezəˈveɪʃn/', meaning: 'Sự đặt trước', examples: ['Table reservation. (Đặt bàn trước.)', 'Cancel reservation. (Hủy đặt trước.)', 'Keep reservation. (Giữ chỗ đã đặt.)'] },
                        { word: 'Itinerary', phonetic: '/aɪˈtɪnərəri/', meaning: 'Lộ trình chuyến đi', examples: ['Planned itinerary. (Lịch trình đã định.)', 'Change the itinerary. (Thay đổi lộ trình.)', 'Daily itinerary. (Lộ trình hàng ngày.)'] },
                    ],
                    quizzes: [
                        { question: 'Nơi có thể ngủ qua đêm khi du lịch?', options: ['Field', 'Accommodation', 'Sky', 'River'], correctAnswer: 'Accommodation', tip: 'Accommodation là chỗ ở.' },
                        { question: 'Bản kế hoạch chuyến đi gọi là gì?', options: ['Map', 'Itinerary', 'Box', 'Pen'], correctAnswer: 'Itinerary', tip: 'Itinerary là lộ trình.' },
                        { question: 'Giữ chỗ trước gọi là gì?', options: ['Ending', 'Reservation', 'Bye', 'Start'], correctAnswer: 'Reservation', tip: 'Reservation là đặt trước.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Landmark', phonetic: '/ˈlændmɑːk/', meaning: 'Thắng cảnh/Mốc giới', examples: ['Historical landmark. (Địa danh lịch sử.)', 'Famous landmark. (Địa danh nổi tiếng.)', 'City landmark. (Biểu tượng thành phố.)'] },
                        { word: 'Explore', phonetic: '/ɪkˈsplɔː(r)/', meaning: 'Khám phá', examples: ['Explore new places. (Khám phá nơi mới.)', 'Explore the world. (Khám phá thế giới.)', 'Time to explore. (Thời gian để khám phá.)'] },
                        { word: 'Experience', phonetic: '/ɪkˈspɪəriəns/', meaning: 'Trải nghiệm', examples: ['Wonderful experience. (Trải nghiệm tuyệt vời.)', 'Travel experience. (Kinh nghiệm du lịch.)', 'Once-in-a-lifetime experience. (Trải nghiệm để đời.)'] },
                    ],
                    quizzes: [
                        { question: 'Hoạt động đi tìm hiểu cái mới?', options: ['Stay', 'Explore', 'Sleep', 'Close'], correctAnswer: 'Explore', tip: 'Explore là khám phá.' },
                        { question: 'Địa điểm biểu tượng của thành phố?', options: ['Dust', 'Landmark', 'Road', 'Pen'], correctAnswer: 'Landmark', tip: 'Landmark là thắng cảnh.' },
                        { question: 'Những gì bạn tích lũy qua chuyến đi?', options: ['Experience', 'Loss', 'Hate', 'Fear'], correctAnswer: 'Experience', tip: 'Experience là trải nghiệm.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Navigation', phonetic: '/ˌnævɪˈɡeɪʃn/', meaning: 'Sự định hướng/Dẫn đường', examples: ['Navigation system. (Hệ thống dẫn đường.)', 'Map navigation. (Dẫn đường qua bản đồ.)', 'Lost navigation. (Mất định hướng.)'] },
                        { word: 'Compass', phonetic: '/ˈkʌmpəs/', meaning: 'La bàn', examples: ['Use a compass. (Sử dụng la bàn.)', 'Digital compass. (La bàn kỹ thuật số.)', 'Lost compass. (Mất la bàn.)'] },
                        { word: 'Terminal', phonetic: '/ˈtɜːmɪnl/', meaning: 'Nhà ga', examples: ['Domestic terminal. (Nhà ga quốc nội.)', 'Wait at the terminal. (Chờ ở nhà ga.)', 'Modern terminal. (Nhà ga hiện đại.)'] },
                    ],
                    quizzes: [
                        { question: 'Dụng cụ chỉ hướng Bắc, Nam...?', options: ['Compass', 'Book', 'Key', 'Bag'], correctAnswer: 'Compass', tip: 'Compass là la bàn.' },
                        { question: 'Việc xác định đường đi gọi là?', options: ['Sleeping', 'Navigation', 'Eating', 'Driving'], correctAnswer: 'Navigation', tip: 'Navigation là dẫn đường.' },
                        { question: 'Nơi tập kết các chuyến bay/tàu?', options: ['Terminal', 'Lake', 'Park', 'Gym'], correctAnswer: 'Terminal', tip: 'Terminal là nhà ga.' },
                    ]
                },
            ]
        },
        {
            id: 'lesson-3',
            title: 'Work & Career',
            order: 3,
            tips: 'Networking là chìa khóa để thăng tiến.',
            chunks: [
                {
                    vocab: [
                        { word: 'Occupation', phonetic: '/ˌɒkjuˈpeɪʃn/', meaning: 'Nghề nghiệp', examples: ['State your occupation. (Nêu nghề nghiệp của bạn.)', 'What is your occupation? (Nghề nghiệp của bạn là gì?)', 'Current occupation. (Nghề nghiệp hiện tại.)'] },
                        { word: 'Salary', phonetic: '/ˈsæləri/', meaning: 'Tiền lương', examples: ['High salary. (Lương cao.)', 'Monthly salary. (Lương hàng tháng.)', 'Salary increase. (Tăng lương.)'] },
                        { word: 'Promotion', phonetic: '/prəˈməʊʃn/', meaning: 'Sự thăng tiến', examples: ['Get a promotion. (Được thăng chức.)', 'Seek promotion. (Tìm kiếm sự thăng tiến.)', 'Rapid promotion. (Thăng tiến nhanh chóng.)'] },
                    ],
                    quizzes: [
                        { question: 'Từ nào chỉ công việc chính của bạn?', options: ['Game', 'Occupation', 'Play', 'Sleep'], correctAnswer: 'Occupation', tip: 'Occupation là nghề nghiệp.' },
                        { question: 'Số tiền bạn nhận được mỗi tháng?', options: ['Gift', 'Debt', 'Salary', 'Tax'], correctAnswer: 'Salary', tip: 'Salary là tiền lương.' },
                        { question: 'Khi bạn được giữ chức vụ cao hơn?', options: ['Demotion', 'Promotion', 'Exit', 'Stay'], correctAnswer: 'Promotion', tip: 'Promotion là thăng chức.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Interview', phonetic: '/ˈɪntəvjuː/', meaning: 'Phỏng vấn', examples: ['Job interview. (Phỏng vấn xin việc.)', 'Prepare for an interview. (Chuẩn bị phỏng vấn.)', 'Interview questions. (Các câu hỏi phỏng vấn.)'] },
                        { word: 'Experience', phonetic: '/ɪkˈspɪəriəns/', meaning: 'Kinh nghiệm', examples: ['Work experience. (Kinh nghiệm làm việc.)', 'Lack of experience. (Thiếu kinh nghiệm.)', 'Past experience. (Kinh nghiệm trong quá khứ.)'] },
                        { word: 'Skills', phonetic: '/skɪlz/', meaning: 'Kỹ năng', examples: ['Soft skills. (Kỹ năng mềm.)', 'Develop skills. (Phát triển kỹ năng.)', 'Necessary skills. (Kỹ năng cần thiết.)'] },
                    ],
                    quizzes: [
                        { question: 'Hoạt động hỏi lý lịch khi xin việc?', options: ['Party', 'Interview', 'Dance', 'Movie'], correctAnswer: 'Interview', tip: 'Interview là phỏng vấn.' },
                        { question: 'Bạn cần... để làm tốt công việc?', options: ['Dreams', 'Skills', 'Songs', 'Toys'], correctAnswer: 'Skills', tip: 'Skills là kỹ năng.' },
                        { question: 'Thứ bạn có được sau nhiều năm làm việc?', options: ['Experience', 'Age', 'Height', 'Weight'], correctAnswer: 'Experience', tip: 'Experience là kinh nghiệm.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Qualification', phonetic: '/ˌkwɒlɪfɪˈkeɪʃn/', meaning: 'Bằng cấp/Trình độ', examples: ['Academic qualification. (Trình độ học vấn.)', 'Necessary qualifications. (Bằng cấp cần thiết.)', 'Earn a qualification. (Đạt được bằng cấp.)'] },
                        { word: 'Responsibility', phonetic: '/rɪˌspɒnsəˈbɪləti/', meaning: 'Trách nhiệm', examples: ['Take responsibility. (Chịu trách nhiệm.)', 'Work responsibility. (Trách nhiệm công việc.)', 'Shared responsibility. (Trách nhiệm chung.)'] },
                        { word: 'Project', phonetic: '/ˈprɒdʒekt/', meaning: 'Dự án', examples: ['Start a project. (Bắt đầu dự án.)', 'Manage a project. (Quản lý dự án.)', 'Project deadline. (Hạn chót dự án.)'] },
                    ],
                    quizzes: [
                        { question: 'Bằng đại học là một loại...?', options: ['Qualification', 'Stamp', 'Paper', 'Ink'], correctAnswer: 'Qualification', tip: 'Qualification là bằng cấp.' },
                        { question: 'Nhiệm vụ bạn phải hoàn thành?', options: ['Responsibility', 'Play', 'Fun', 'Rest'], correctAnswer: 'Responsibility', tip: 'Responsibility là trách nhiệm.' },
                        { question: 'Sự kiện có kế hoạch và mục tiêu rõ ràng?', options: ['Project', 'Accident', 'Sleep', 'Joke'], correctAnswer: 'Project', tip: 'Project là dự án.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Deadline', phonetic: '/ˈdedlaɪn/', meaning: 'Hạn chót', examples: ['Meet a deadline. (Đáp ứng kịp thời hạn.)', 'Tight deadline. (Hạn chót sát nút.)', 'Final deadline. (Hạn chót cuối cùng.)'] },
                        { word: 'Colleague', phonetic: '/ˈkɒliːɡ/', meaning: 'Đồng nghiệp', examples: ['Work with colleagues. (Làm việc với đồng nghiệp.)', 'Trusted colleague. (Đồng nghiệp tin cậy.)', 'New colleague. (Đồng nghiệp mới.)'] },
                        { word: 'Management', phonetic: '/ˈmænɪdʒmənt/', meaning: 'Quản lý', examples: ['Time management. (Quản lý thời gian.)', 'Effective management. (Quản lý hiệu quả.)', 'Management team. (Nhóm quản lý.)'] },
                    ],
                    quizzes: [
                        { question: 'Thời điểm cuối cùng phải nộp bài?', options: ['Start', 'Deadline', 'Morning', 'Birth'], correctAnswer: 'Deadline', tip: 'Deadline là hạn chót.' },
                        { question: 'Người làm việc cùng công ty với bạn?', options: ['Family', 'Colleague', 'Neighbor', 'Enemy'], correctAnswer: 'Colleague', tip: 'Colleague là đồng nghiệp.' },
                        { question: 'Việc tổ chức và điều hành gọi là gì?', options: ['Chaos', 'Management', 'Noise', 'Static'], correctAnswer: 'Management', tip: 'Management là quản lý.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Leadership', phonetic: '/ˈliːdəʃɪp/', meaning: 'Lãnh đạo', examples: ['Strong leadership. (Khả năng lãnh đạo mạnh mẽ.)', 'Leadership role. (Vai trò lãnh đạo.)', 'Show leadership. (Thể hiện khả năng lãnh đạo.)'] },
                        { word: 'Strategy', phonetic: '/ˈstrætədʒi/', meaning: 'Chiến lược', examples: ['Business strategy. (Chiến lược kinh doanh.)', 'Global strategy. (Chiến lược toàn cầu.)', 'Marketing strategy. (Chiến lược tiếp thị.)'] },
                        { word: 'Analysis', phonetic: '/əˈnæləsɪs/', meaning: 'Phân tích', examples: ['Data analysis. (Phân tích dữ liệu.)', 'Detailed analysis. (Phân tích chi tiết.)', 'Conduct analysis. (Tiến hành phân tích.)'] },
                    ],
                    quizzes: [
                        { question: 'Vai trò dẫn dắt người khác?', options: ['Follower', 'Leadership', 'Laziness', 'Fear'], correctAnswer: 'Leadership', tip: 'Leadership là lãnh đạo.' },
                        { question: 'Kế hoạch hành động dài hạn?', options: ['Strategy', 'Luck', 'Accident', 'Now'], correctAnswer: 'Strategy', tip: 'Strategy là chiến lược.' },
                        { question: 'Việc xem xét kỹ các dữ liệu?', options: ['Analysis', 'Sleeping', 'Joking', 'Fixed'], correctAnswer: 'Analysis', tip: 'Analysis là phân tích.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Report', phonetic: '/rɪˈpɔːt/', meaning: 'Báo cáo', examples: ['Write a report. (Viết báo cáo.)', 'Monthly report. (Báo cáo hàng tháng.)', 'Financial report. (Báo cáo tài chính.)'] },
                        { word: 'Presentation', phonetic: '/ˌpreznˈteɪʃn/', meaning: 'Thuyết trình', examples: ['Give a presentation. (Làm thuyết trình.)', 'Slide presentation. (Thuyết trình qua slide.)', 'Business presentation. (Thuyết trình kinh doanh.)'] },
                        { word: 'Client', phonetic: '/ˈklaɪənt/', meaning: 'Khách hàng', examples: ['Valued client. (Khách hàng quý giá.)', 'New client. (Khách hàng mới.)', 'Potential client. (Khách hàng tiềm năng.)'] },
                    ],
                    quizzes: [
                        { question: 'Văn bản tóm tắt công việc gọi là?', options: ['Story', 'Report', 'Comic', 'Poem'], correctAnswer: 'Report', tip: 'Report là báo cáo.' },
                        { question: 'Dùng slide để truyền đạt thông tin?', options: ['Presentation', 'Eating', 'Running', 'Singing'], correctAnswer: 'Presentation', tip: 'Presentation là thuyết trình.' },
                        { question: 'Đối tác mua dịch vụ gọi là gì?', options: ['Friend', 'Enemy', 'Client', 'Pet'], correctAnswer: 'Client', tip: 'Client là khách hàng.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Contract', phonetic: '/ˈkɒntrækt/', meaning: 'Hợp đồng', examples: ['Sign a contract. (Ký hợp đồng.)', 'Breach of contract. (Vi phạm hợp đồng.)', 'Legal contract. (Hợp đồng pháp lý.)'] },
                        { word: 'Negotiation', phonetic: '/nɪˌɡəʊʃiˈeɪʃn/', meaning: 'Thương lượng', examples: ['Start negotiation. (Bắt đầu thương lượng.)', 'Salary negotiation. (Thương lượng lương.)', 'Successful negotiation. (Thương lượng thành công.)'] },
                        { word: 'Budget', phonetic: '/ˈbʌdʒɪt/', meaning: 'Ngân sách', examples: ['Allocated budget. (Ngân sách được phân bổ.)', 'Tight budget. (Ngân sách eo hẹp.)', 'Total budget. (Tổng ngân sách.)'] },
                    ],
                    quizzes: [
                        { question: 'Văn bản cam kết giữa 2 bên?', options: ['Book', 'Contract', 'Map', 'Ink'], correctAnswer: 'Contract', tip: 'Contract là hợp đồng.' },
                        { question: 'Hoạt động bàn bạc để đạt thỏa thuận?', options: ['Fight', 'Negotiation', 'Run', 'Eat'], correctAnswer: 'Negotiation', tip: 'Negotiation là thương lượng.' },
                        { question: 'Số tiền giới hạn được chi tiêu?', options: ['Budget', 'Sky', 'Mountain', 'Cloud'], correctAnswer: 'Budget', tip: 'Budget là ngân sách.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Profit', phonetic: '/ˈprɒfɪt/', meaning: 'Lợi nhuận', examples: ['Net profit. (Lợi nhuận ròng.)', 'Generate profit. (Tạo ra lợi nhuận.)', 'Profit margin. (Biên lợi nhuận.)'] },
                        { word: 'Career', phonetic: '/kəˈrɪə(r)/', meaning: 'Sự nghiệp', examples: ['Choose a career. (Chọn sự nghiệp.)', 'Career goals. (Mục tiêu sự nghiệp.)', 'Successful career. (Sự nghiệp thành công.)'] },
                        { word: 'Ambition', phonetic: '/æmˈbɪʃn/', meaning: 'Tham vọng', examples: ['Driven by ambition. (Bị thúc đẩy bởi tham vọng.)', 'Great ambition. (Tham vọng lớn.)', 'Personal ambition. (Tham vọng cá nhân.)'] },
                    ],
                    quizzes: [
                        { question: 'Tiền lãi kiếm được sau khi trừ phí?', options: ['Loss', 'Profit', 'Debt', 'Tax'], correctAnswer: 'Profit', tip: 'Profit là lợi nhuận.' },
                        { question: 'Con đường phát triển công việc lâu dài?', options: ['Day', 'Career', 'Week', 'Rest'], correctAnswer: 'Career', tip: 'Career là sự nghiệp.' },
                        { question: 'Mong muốn đạt thành tựu lớn?', options: ['Fear', 'Ambition', 'Sadness', 'Sleep'], correctAnswer: 'Ambition', tip: 'Ambition là tham vọng.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Opportunity', phonetic: '/ˌɒpəˈtjuːnəti/', meaning: 'Cơ hội', examples: ['Once-in-a-lifetime opportunity. (Cơ hội ngàn năm có một.)', 'Business opportunity. (Cơ hội kinh doanh.)', 'Nắm bắt cơ hội. (Seize the opportunity.)'] },
                        { word: 'Feedback', phonetic: '/ˈfiːdbæk/', meaning: 'Phản hồi', examples: ['Constructive feedback. (Phản hồi mang tính xây dựng.)', 'Customer feedback. (Phản hồi của khách hàng.)', 'Receiving feedback. (Nhận phản hồi.)'] },
                        { word: 'Performance', phonetic: '/pəˈfɔːməns/', meaning: 'Hiệu suất', examples: ['High performance. (Hiệu suất cao.)', 'Performance evaluation. (Đánh giá hiệu suất.)', 'Academic performance. (Kết quả học tập.)'] },
                    ],
                    quizzes: [
                        { question: 'Thời điểm thuận lợi để làm điều gì đó?', options: ['End', 'Opportunity', 'Wait', 'Stop'], correctAnswer: 'Opportunity', tip: 'Opportunity là cơ hội.' },
                        { question: 'Sự nhận xét về kết quả công việc?', options: ['Feedback', 'Song', 'Noise', 'Static'], correctAnswer: 'Feedback', tip: 'Feedback là phản hồi.' },
                        { question: 'Mức độ làm việc hiệu quả của bạn?', options: ['Height', 'Performance', 'Weight', 'Color'], correctAnswer: 'Performance', tip: 'Performance là hiệu suất.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Evaluation', phonetic: '/ɪˌvæljuˈeɪʃn/', meaning: 'Đánh giá', examples: ['Job evaluation. (Đánh giá công việc.)', 'Constant evaluation. (Đánh giá liên tục.)', 'Needs evaluation. (Sự đánh giá cần thiết.)'] },
                        { word: 'Success', phonetic: '/səkˈses/', meaning: 'Thành công', examples: ['Achieve success. (Đạt thành công.)', 'Key to success. (Chìa khóa thành công.)', 'Long-term success. (Thành công lâu dài.)'] },
                        { word: 'Motivation', phonetic: '/ˌməʊtɪˈveɪʃn/', meaning: 'Động lực', examples: ['Lack of motivation. (Thiếu động lực.)', 'Strong motivation. (Động lực mạnh mẽ.)', 'Find motivation. (Tìm thấy động lực.)'] },
                    ],
                    quizzes: [
                        { question: 'Quá trình xem xét và cho điểm chất lượng?', options: ['Evaluation', 'Eating', 'Running', 'Sleeping'], correctAnswer: 'Evaluation', tip: 'Evaluation là đánh giá.' },
                        { question: 'Trái nghĩa với "Failure" là gì?', options: ['Success', 'Sadness', 'Rain', 'Dark'], correctAnswer: 'Success', tip: 'Success là thành công.' },
                        { question: 'Thứ thúc đẩy bạn làm việc?', options: ['Lazy', 'Motivation', 'Fear', 'Hunger'], correctAnswer: 'Motivation', tip: 'Motivation là động lực.' },
                    ]
                },
            ]
        },
        {
            id: 'lesson-4',
            title: 'Food & Dining',
            order: 4,
            tips: 'Hãy thử các món ăn địa phương khi đi du lịch.',
            chunks: [
                {
                    vocab: [
                        { word: 'Ingredient', phonetic: '/ɪnˈɡriːdiənt/', meaning: 'Nguyên liệu', examples: ['Fresh ingredients. (Nguyên liệu tươi.)', 'Mix the ingredients. (Trộn nguyên liệu.)', 'Key ingredient. (Nguyên liệu chính.)'] },
                        { word: 'Recipe', phonetic: '/ˈresəpi/', meaning: 'Công thức', examples: ['Follow a recipe. (Theo công thức.)', 'Secret recipe. (Công thức bí mật.)', 'Share a recipe. (Chia sẻ công thức.)'] },
                        { word: 'Flavor', phonetic: '/ˈfleɪvə(r)/', meaning: 'Hương vị', examples: ['Natural flavor. (Hương vị tự nhiên.)', 'Add flavor. (Thêm hương vị.)', 'Different flavors. (Nhiều hương vị.)'] },
                    ],
                    quizzes: [
                        { question: 'Công thức hướng dẫn nấu ăn?', options: ['Rule', 'Recipe', 'Story', 'Law'], correctAnswer: 'Recipe', tip: 'Recipe là công thức.' },
                        { question: 'Thành phần tạo nên món ăn?', options: ['Tool', 'Ingredient', 'Box', 'Chair'], correctAnswer: 'Ingredient', tip: 'Ingredient là nguyên liệu.' },
                        { question: 'Thứ bạn cảm nhận bằng vị giác?', options: ['Sound', 'Flavor', 'Light', 'Static'], correctAnswer: 'Flavor', tip: 'Flavor là hương vị.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Cuisine', phonetic: '/kwɪˈziːn/', meaning: 'Ẩm thực', examples: ['Local cuisine. (Ẩm thực địa phương.)', 'Fine cuisine. (Ẩm thực cao cấp.)', 'Vietnamese cuisine. (Ẩm thực Việt.)'] },
                        { word: 'Appetizer', phonetic: '/ˈæpɪtaɪzə(r)/', meaning: 'Món khai vị', examples: ['Order an appetizer. (Gọi món khai vị.)', 'Light appetizer. (Khai vị nhẹ.)', 'Appetizer menu. (Thực đơn khai vị.)'] },
                        { word: 'Dessert', phonetic: '/dɪˈzɜːt/', meaning: 'Món tráng miệng', examples: ['Sweet dessert. (Tráng miệng ngọt.)', 'Fruit dessert. (Trái cây tráng miệng.)', 'Dessert selection. (Lựa chọn tráng miệng.)'] },
                    ],
                    quizzes: [
                        { question: 'Món ăn ngọt cuối bữa?', options: ['Soup', 'Dessert', 'Appetizer', 'Meat'], correctAnswer: 'Dessert', tip: 'Dessert là tráng miệng.' },
                        { question: 'Phong cách nấu ăn của một vùng?', options: ['Sport', 'Cuisine', 'Music', 'Fashion'], correctAnswer: 'Cuisine', tip: 'Cuisine là ẩm thực.' },
                        { question: 'Món ăn mở đầu thực đơn?', options: ['Coffee', 'Appetizer', 'Bill', 'Napkin'], correctAnswer: 'Appetizer', tip: 'Appetizer là khai vị.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Beverage', phonetic: '/ˈbevərɪdʒ/', meaning: 'Đồ uống', examples: ['Cold beverage. (Đồ uống lạnh.)', 'Alcoholic beverage. (Đồ uống có cồn.)', 'Beverage section. (Khu vực đồ uống.)'] },
                        { word: 'Nutrition', phonetic: '/njuˈtrɪʃn/', meaning: 'Dinh dưỡng', examples: ['Daily nutrition. (Dinh dưỡng hàng ngày.)', 'Good nutrition. (Dinh dưỡng tốt.)', 'Nutrition facts. (Thông tin dinh dưỡng.)'] },
                        { word: 'Healthy', phonetic: '/ˈhelθi/', meaning: 'Lành mạnh', examples: ['Healthy diet. (Chế độ ăn lành mạnh.)', 'Keep healthy. (Giữ sức khỏe.)', 'Healthy choices. (Lựa chọn lành mạnh.)'] },
                    ],
                    quizzes: [
                        { question: 'Tên gọi khác của nước giải khát?', options: ['Cookie', 'Beverage', 'Burger', 'Pizza'], correctAnswer: 'Beverage', tip: 'Beverage là đồ uống.' },
                        { question: 'Giá trị bổ dưỡng của thực phẩm?', options: ['Nutrition', 'Muscle', 'Blood', 'Bone'], correctAnswer: 'Nutrition', tip: 'Nutrition là dinh dưỡng.' },
                        { question: 'Thực phẩm tốt cho cơ thể?', options: ['Dirty', 'Healthy', 'Old', 'Broken'], correctAnswer: 'Healthy', tip: 'Healthy là lành mạnh.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Organic', phonetic: '/ɔːˈɡænɪk/', meaning: 'Hữu cơ', examples: ['Organic farming. (Canh tác hữu cơ.)', 'Organic food. (Thực phẩm hữu cơ.)', 'Certified organic. (Chứng nhận hữu cơ.)'] },
                        { word: 'Fresh', phonetic: '/freʃ/', meaning: 'Tươi mới', examples: ['Fresh seafood. (Hải sản tươi.)', 'Fresh bread. (Bánh mì mới nướng.)', 'Stay fresh. (Giữ tươi.)'] },
                        { word: 'Spicy', phonetic: '/ˈspaɪsi/', meaning: 'Cay', examples: ['Spicy noodles. (Mì cay.)', 'Too spicy. (Quá cay.)', 'Mildly spicy. (Cay nhẹ.)'] },
                    ],
                    quizzes: [
                        { question: 'Thực phẩm nuôi trồng tự nhiên?', options: ['Fake', 'Organic', 'Plastic', 'Old'], correctAnswer: 'Organic', tip: 'Organic là hữu cơ.' },
                        { question: 'Vị của ớt hoặc hồ tiêu?', options: ['Sweet', 'Spicy', 'Sour', 'Cold'], correctAnswer: 'Spicy', tip: 'Spicy là cay.' },
                        { question: 'Thực phẩm mới thu hoạch?', options: ['Rotten', 'Fresh', 'Dry', 'Salty'], correctAnswer: 'Fresh', tip: 'Fresh là tươi.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Sweet', phonetic: '/swiːt/', meaning: 'Ngọt', examples: ['Sweet tea. (Trà ngọt.)', 'Sweet taste. (Vị ngọt.)', 'Sweet candies. (Kẹo ngọt.)'] },
                        { word: 'Sour', phonetic: '/ˈsaʊə(r)/', meaning: 'Chua', examples: ['Sour lime. (Chanh chua.)', 'Taste sour. (Vị chua.)', 'Sour grapes. (Nho chua.)'] },
                        { word: 'Salty', phonetic: '/ˈsɔːlti/', meaning: 'Mặn', examples: ['Salty popcorn. (Bỏng ngô mặn.)', 'Too salty. (Quá mặn.)', 'Salty sea. (Biển mặn.)'] },
                    ],
                    quizzes: [
                        { question: 'Vị đặc trưng của đường?', options: ['Sour', 'Sweet', 'Bitter', 'Salty'], correctAnswer: 'Sweet', tip: 'Sweet là ngọt.' },
                        { question: 'Vị đặc trưng của giấm/chanh?', options: ['Sour', 'Sweet', 'Salty', 'Hot'], correctAnswer: 'Sour', tip: 'Sour là chua.' },
                        { question: 'Vị của muối biển?', options: ['Salty', 'Sour', 'Spicy', 'Cold'], correctAnswer: 'Salty', tip: 'Salty là mặn.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Bitter', phonetic: '/ˈbɪtə(r)/', meaning: 'Đắng', examples: ['Bitter melon. (Mướp đắng.)', 'Bitter medicine. (Thuốc đắng.)', 'Bitter dark chocolate. (Sô cô la đắng.)'] },
                        { word: 'Delicious', phonetic: '/dɪˈlɪʃəs/', meaning: 'Ngon', examples: ['Delicious dinner. (Bữa tối ngon.)', 'Look delicious. (Trông ngon miệng.)', 'Taste delicious. (Vị rất ngon.)'] },
                        { word: 'Fragrant', phonetic: '/ˈfreɪɡrənt/', meaning: 'Thơm ngát', examples: ['Fragrant herbs. (Thảo mộc thơm.)', 'Fragrant jasmine. (Hoa nhài thơm.)', 'Smell fragrant. (Mùi hương thơm.)'] },
                    ],
                    quizzes: [
                        { question: 'Vị của thuốc hoặc mướp đắng?', options: ['Sweet', 'Bitter', 'Salty', 'Sour'], correctAnswer: 'Bitter', tip: 'Bitter là đắng.' },
                        { question: 'Từ dùng để khen đồ ăn ngon?', options: ['Bad', 'Delicious', 'Sad', 'Cold'], correctAnswer: 'Delicious', tip: 'Delicious là ngon.' },
                        { question: 'Mùi hương dễ chịu của món ăn?', options: ['Dirty', 'Fragrant', 'Old', 'Noise'], correctAnswer: 'Fragrant', tip: 'Fragrant là thơm.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Texture', phonetic: '/ˈtekstʃə(r)/', meaning: 'Cấu trúc', examples: ['Crunchy texture. (Cấu trúc giòn.)', 'Soft texture. (Cấu trúc mềm.)', 'Smooth texture. (Cấu trúc mịn.)'] },
                        { word: 'Restaurant', phonetic: '/ˈrestrɒnt/', meaning: 'Nhà hàng', examples: ['Book a restaurant. (Đặt nhà hàng.)', 'Busy restaurant. (Nhà hàng đông đúc.)', 'Vegetarian restaurant. (Nhà hàng chay.)'] },
                        { word: 'Menu', phonetic: '/ˈmenjuː/', meaning: 'Thực đơn', examples: ['Today\'s menu. (Thực đơn hôm nay.)', 'Dinner menu. (Thực đơn tối.)', 'Scan the menu. (Xem qua thực đơn.)'] },
                    ],
                    quizzes: [
                        { question: 'Nơi phục vụ đồ ăn chuyên nghiệp?', options: ['Gym', 'Restaurant', 'Library', 'Park'], correctAnswer: 'Restaurant', tip: 'Restaurant là nhà hàng.' },
                        { question: 'Danh sách các món ăn có sẵn?', options: ['Map', 'Menu', 'Book', 'Paper'], correctAnswer: 'Menu', tip: 'Menu là thực đơn.' },
                        { question: 'Độ giòn/mềm của thức ăn?', options: ['Color', 'Texture', 'Sound', 'Price'], correctAnswer: 'Texture', tip: 'Texture là cấu trúc.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Order', phonetic: '/ˈɔːdə(r)/', meaning: 'Gọi món', examples: ['Place an order. (Đặt hàng/Đặt món.)', 'Ready to order. (Sẵn sàng gọi món.)', 'Online order. (Đặt hàng qua mạng.)'] },
                        { word: 'Service', phonetic: '/ˈsɜːvɪs/', meaning: 'Dịch vụ', examples: ['Customer service. (Dịch vụ khách hàng.)', 'Fast service. (Phục vụ nhanh.)', 'Great service. (Dịch vụ tốt.)'] },
                        { word: 'Tip', phonetic: '/tɪp/', meaning: 'Tiền boa', examples: ['Leave a tip. (Để lại tiền boa.)', 'Small tip. (Tiền boa nhỏ.)', 'Tip the driver. (Boa cho tài xế.)'] },
                    ],
                    quizzes: [
                        { question: 'Yêu cầu món ăn tại bàn?', options: ['Order', 'Sleep', 'Run', 'Sing'], correctAnswer: 'Order', tip: 'Order là gọi món.' },
                        { question: 'Tiền thưởng cho người phục vụ?', options: ['Bill', 'Tip', 'Debt', 'Price'], correctAnswer: 'Tip', tip: 'Tip là tiền boa.' },
                        { question: 'Thái độ phục vụ của nhân viên?', options: ['Service', 'Clothes', 'Hair', 'Face'], correctAnswer: 'Service', tip: 'Service là dịch vụ.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Reservation', phonetic: '/ˌrezəˈveɪʃn/', meaning: 'Sự đặt bàn', examples: ['Make a reservation. (Đặt bàn trước.)', 'Cancel a reservation. (Hủy đặt bàn.)', 'Group reservation. (Đặt cho nhóm.)'] },
                        { word: 'Platter', phonetic: '/ˈplætə(r)/', meaning: 'Đĩa lớn', examples: ['Fruit platter. (Đĩa trái cây lớn.)', 'Seafood platter. (Đĩa hải sản lớn.)', 'Shared platter. (Đĩa ăn chung.)'] },
                        { word: 'Utensil', phonetic: '/juːˈtensl/', meaning: 'Dụng cụ ăn', examples: ['Use utensils. (Sử dụng dụng cụ ăn.)', 'Kitchen utensils. (Dụng cụ bếp.)', 'Clean utensils. (Dụng cụ sạch.)'] },
                    ],
                    quizzes: [
                        { question: 'Thao tác giữ chỗ trước?', options: ['Ending', 'Reservation', 'Start', 'Bye'], correctAnswer: 'Reservation', tip: 'Reservation là đặt bàn.' },
                        { question: 'Dụng cụ ăn (muỗng, nĩa...)?', options: ['Clothes', 'Utensil', 'Books', 'Toys'], correctAnswer: 'Utensil', tip: 'Utensil là dụng cụ.' },
                        { question: 'Đĩa phẳng lớn bày đồ ăn?', options: ['Cup', 'Platter', 'Key', 'Pen'], correctAnswer: 'Platter', tip: 'Platter là đĩa lớn.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Banquet', phonetic: '/ˈbæŋkwɪt/', meaning: 'Đại tiệc', examples: ['Wedding banquet. (Tiệc cưới.)', 'State banquet. (Quốc yến.)', 'Banquet hall. (Hội trường tiệc.)'] },
                        { word: 'Buffet', phonetic: '/ˈbʊfeɪ/', meaning: 'Tiệc đứng', examples: ['Lunch buffet. (Buffet trưa.)', 'Breakfast buffet. (Buffet sáng.)', 'Buffet restaurant. (Nhà hàng buffet.)'] },
                        { word: 'Specialty', phonetic: '/ˈspeʃəlti/', meaning: 'Đặc sản', examples: ['Local specialty. (Đặc sản địa phương.)', 'Chef\'s specialty. (Món tủ của bếp trưởng.)', 'Unique specialty. (Đặc sản độc đáo.)'] },
                    ],
                    quizzes: [
                        { question: 'Bữa tiệc tự chọn thức ăn?', options: ['Alone', 'Buffet', 'Private', 'Single'], correctAnswer: 'Buffet', tip: 'Buffet là tiệc đứng.' },
                        { question: 'Món ăn đặc sắc nhất của vùng?', options: ['Road', 'Specialty', 'Dust', 'Ink'], correctAnswer: 'Specialty', tip: 'Specialty là đặc sản.' },
                        { question: 'Bữa tiệc trọng đại theo nghi lễ?', options: ['Nap', 'Banquet', 'Rest', 'Joke'], correctAnswer: 'Banquet', tip: 'Banquet là đại tiệc.' },
                    ]
                },
            ]
        },
        {
            id: 'lesson-5',
            title: 'Shopping & Lifestyle',
            order: 5,
            tips: 'Kiểm tra kỹ hóa đơn trước khi thanh toán.',
            chunks: [
                {
                    vocab: [
                        { word: 'Purchase', phonetic: '/ˈpɜːtʃəs/', meaning: 'Mua sắm', examples: ['Make a purchase. (Thực hiện mua sắm.)', 'Online purchase. (Mua sắm trực tuyến.)', 'Proof of purchase. (Bằng chứng mua hàng.)'] },
                        { word: 'Bargain', phonetic: '/ˈbɑːɡən/', meaning: 'Mặc cả', examples: ['Drive a bargain. (Mặc cả giá.)', 'What a bargain! (Thật là một món hời!)', 'Bargain price. (Giá hời.)'] },
                        { word: 'Discount', phonetic: '/ˈdɪskaʊnt/', meaning: 'Giảm giá', examples: ['Get a discount. (Được giảm giá.)', 'Special discount. (Giảm giá đặc biệt.)', 'Discount code. (Mã giảm giá.)'] },
                    ],
                    quizzes: [
                        { question: 'Hoạt động mua hàng hóa?', options: ['Purchase', 'Sleep', 'Run', 'Sing'], correctAnswer: 'Purchase', tip: 'Purchase là mua sắm.' },
                        { question: 'Khi giá món đồ thấp hơn bình thường?', options: ['High', 'Discount', 'Up', 'Old'], correctAnswer: 'Discount', tip: 'Discount là giảm giá.' },
                        { question: 'Thỏa thuận để có giá tốt hơn?', options: ['Bargain', 'Sing', 'Dance', 'Cry'], correctAnswer: 'Bargain', tip: 'Bargain là mặc cả.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Receipt', phonetic: '/rɪˈsiːt/', meaning: 'Hóa đơn', examples: ['Ask for a receipt. (Xin hóa đơn.)', 'Keep the receipt. (Giữ hóa đơn.)', 'Sales receipt. (Hóa đơn bán hàng.)'] },
                        { word: 'Refund', phonetic: '/ˈriːfʌnd/', meaning: 'Hoàn tiền', examples: ['Full refund. (Hoàn tiền toàn bộ.)', 'Request a refund. (Yêu cầu hoàn tiền.)', 'Refund policy. (Chính sách hoàn tiền.)'] },
                        { word: 'Quality', phonetic: '/ˈkwɒləti/', meaning: 'Chất lượng', examples: ['High quality. (Chất lượng cao.)', 'Quality control. (Kiểm soát chất lượng.)', 'Premium quality. (Chất lượng cao cấp.)'] },
                    ],
                    quizzes: [
                        { question: 'Mức độ tốt/xấu của sản phẩm?', options: ['Size', 'Quality', 'Weight', 'Color'], correctAnswer: 'Quality', tip: 'Quality là chất lượng.' },
                        { question: 'Nhận lại tiền khi trả hàng?', options: ['Refund', 'Gift', 'Debt', 'Price'], correctAnswer: 'Refund', tip: 'Refund là hoàn tiền.' },
                        { question: 'Tờ phiếu xác nhận đã thanh toán?', options: ['Map', 'Receipt', 'Stamp', 'Ink'], correctAnswer: 'Receipt', tip: 'Receipt là hóa đơn.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Brand', phonetic: '/brænd/', meaning: 'Thương hiệu', examples: ['Luxury brand. (Thương hiệu xa xỉ.)', 'Brand name. (Tên thương hiệu.)', 'Build a brand. (Xây dựng thương hiệu.)'] },
                        { word: 'Fashion', phonetic: '/ˈfæʃn/', meaning: 'Thời trang', examples: ['Follow fashion. (Theo đuổi thời trang.)', 'Fashion industry. (Ngành thời trang.)', 'Old-fashioned. (Lỗi mốt.)'] },
                        { word: 'Trend', phonetic: '/trend/', meaning: 'Xu hướng', examples: ['Set a trend. (Tạo xu hướng.)', 'Latest trend. (Xu hướng mới nhất.)', 'Market trend. (Xu hướng thị trường.)'] },
                    ],
                    quizzes: [
                        { question: 'Tên nhãn hiệu hàng hóa?', options: ['Box', 'Brand', 'Paper', 'Pen'], correctAnswer: 'Brand', tip: 'Brand là thương hiệu.' },
                        { question: 'Phong cách ăn mặc thịnh hành?', options: ['Fashion', 'Old', 'Broken', 'Dust'], correctAnswer: 'Fashion', tip: 'Fashion là thời trang.' },
                        { question: 'Trào lưu đang được yêu thích?', options: ['Trend', 'Stay', 'Stop', 'Fixed'], correctAnswer: 'Trend', tip: 'Trend là xu hướng.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Style', phonetic: '/staɪl/', meaning: 'Phong cách', examples: ['Personal style. (Phong cách cá nhân.)', 'Modern style. (Phong cách hiện đại.)', 'In style. (Hợp thời trang.)'] },
                        { word: 'Design', phonetic: '/dɪˈzaɪn/', meaning: 'Thiết kế', examples: ['Graphic design. (Thiết kế đồ họa.)', 'Sleek design. (Thiết kế mượt mà.)', 'Original design. (Thiết kế nguyên bản.)'] },
                        { word: 'Comfort', phonetic: '/ˈkʌmfət/', meaning: 'Sự thoải mái', examples: ['Maximum comfort. (Sự thoải mái tối đa.)', 'Comfort zone. (Vùng an toàn/thoải mái.)', 'A sense of comfort. (Cảm giác thoải mái.)'] },
                    ],
                    quizzes: [
                        { question: 'Gu thẩm mỹ hoặc cách thức riêng?', options: ['Style', 'Accident', 'Loss', 'Hate'], correctAnswer: 'Style', tip: 'Style là phong cách.' },
                        { question: 'Phác thảo và tạo hình sản phẩm?', options: ['Design', 'Sleep', 'Run', 'Sing'], correctAnswer: 'Design', tip: 'Design là thiết kế.' },
                        { question: 'Cảm giác dễ chịu khi trải nghiệm?', options: ['Pain', 'Comfort', 'Noise', 'Fear'], correctAnswer: 'Comfort', tip: 'Comfort là thoải mái.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Luxury', phonetic: '/ˈlʌkʃəri/', meaning: 'Xa xỉ', examples: ['Luxury lifestyle. (Lối sống xa hoa.)', 'Luxury goods. (Hàng hóa xa xỉ.)', 'A bit of luxury. (Một chút sang trọng.)'] },
                        { word: 'Essential', phonetic: '/ɪˈsenʃl/', meaning: 'Thiết yếu', examples: ['Essential needs. (Nhu cầu thiết yếu.)', 'Daily essentials. (Vật dụng thiết yếu hàng ngày.)', 'Essential skills. (Kỹ năng thiết yếu.)'] },
                        { word: 'Household', phonetic: '/ˈhaʊshəʊld/', meaning: 'Gia quyến/Trong nhà', examples: ['Household income. (Thu nhập hộ gia đình.)', 'Household items. (Đồ dùng trong nhà.)', 'Run a household. (Quản lý gia đình.)'] },
                    ],
                    quizzes: [
                        { question: 'Đồ dùng cực kỳ quan trọng và cần thiết?', options: ['Trash', 'Essential', 'Toy', 'Box'], correctAnswer: 'Essential', tip: 'Essential là thiết yếu.' },
                        { question: 'Mọi người sống chung trong một mái nhà?', options: ['Space', 'Household', 'Field', 'Sky'], correctAnswer: 'Household', tip: 'Household là hộ gia đình.' },
                        { question: 'Sự giàu sang và đắt đỏ?', options: ['Luxury', 'Sadness', 'Rain', 'Dark'], correctAnswer: 'Luxury', tip: 'Luxury là xa xỉ.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Appliance', phonetic: '/əˈplaɪəns/', meaning: 'Thiết bị', examples: ['Home appliances. (Thiết bị gia dụng.)', 'Electric appliance. (Thiết bị điện.)', 'New appliances. (Thiết bị mới.)'] },
                        { word: 'Electronic', phonetic: '/ɪˌlekˈtrɒnɪk/', meaning: 'Điện tử', examples: ['Electronic devices. (Thiết bị điện tử.)', 'Electronic banking. (Ngân hàng điện tử.)', 'State-of-the-art electronic. (Điện tử hiện đại nhất.)'] },
                        { word: 'Hobby', phonetic: '/ˈhɒbi/', meaning: 'Sở thích', examples: ['Find a hobby. (Tìm một sở thích.)', 'Favorite hobby. (Sở thích yêu thích.)', 'Active hobby. (Sở thích năng động.)'] },
                    ],
                    quizzes: [
                        { question: 'Máy móc gia dụng trong nhà?', options: ['Appliance', 'Tree', 'Stone', 'River'], correctAnswer: 'Appliance', tip: 'Appliance là thiết bị.' },
                        { question: 'Công nghệ liên quan đến vi mạch?', options: ['Electronic', 'Water', 'Manual', 'Old'], correctAnswer: 'Electronic', tip: 'Electronic là điện tử.' },
                        { question: 'Việc thích làm lúc rảnh rỗi?', options: ['Work', 'Hobby', 'Task', 'Debt'], correctAnswer: 'Hobby', tip: 'Hobby là sở thích.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Fitness', phonetic: '/ˈfɪtnəs/', meaning: 'Thể hình', examples: ['Fitness goal. (Mục tiêu thể hình.)', 'Stay in fitness. (Giữ vóc dáng.)', 'Fitness tracking. (Theo dõi thể chất.)'] },
                        { word: 'Wellness', phonetic: '/ˈwelnəs/', meaning: 'Sức khỏe toàn diện', examples: ['Wellness retreat. (Nơi nghỉ dưỡng chăm sóc sức khỏe.)', 'Promote wellness. (Tăng cường sức khỏe.)', 'Wellness coach. (Huấn luyện viên sức khỏe.)'] },
                        { word: 'Routine', phonetic: '/ruːˈtiːn/', meaning: 'Lề thói/Thói quen', examples: ['Strict routine. (Lề thói nghiêm ngặt.)', 'Daily routine. (Thói quen hàng ngày.)', 'Break the routine. (Phá vỡ thói quen.)'] },
                    ],
                    quizzes: [
                        { question: 'Vẻ đẹp và sức mạnh của vóc dáng?', options: ['Small', 'Fitness', 'Short', 'Thin'], correctAnswer: 'Fitness', tip: 'Fitness là thể hình.' },
                        { question: 'Các hoạt động lặp lại theo trình tự?', options: ['Routine', 'Surprise', 'Event', 'Party'], correctAnswer: 'Routine', tip: 'Routine là lề thói.' },
                        { question: 'Tình trạng khỏe mạnh thân - tâm?', options: ['Wellness', 'Pain', 'Grief', 'Loss'], correctAnswer: 'Wellness', tip: 'Wellness là sức khỏe toàn diện.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Habit', phonetic: '/ˈhæbɪt/', meaning: 'Thói quen', examples: ['Develop a habit. (Phát triển thói quen.)', 'Kick a habit. (Bỏ một thói quen.)', 'Regular habit. (Thói quen thường xuyên.)'] },
                        { word: 'Leisure', phonetic: '/ˈleʒə(r)/', meaning: 'Giải trí/Lúc rảnh', examples: ['Leisure facilities. (Cơ sở vật chất giải trí.)', 'Leisure industry. (Ngành công nghiệp giải trí.)', 'Enjoy leisure. (Tận hưởng lúc rảnh rỗi.)'] },
                        { word: 'Entertainment', phonetic: '/ˌentəˈteɪnmənt/', meaning: 'Sự tiêu khiển', examples: ['Popular entertainment. (Tiêu khiển phổ biến.)', 'Mass entertainment. (Tiêu khiển đại chúng.)', 'Entertainment venue. (Địa điểm tiêu khiển.)'] },
                    ],
                    quizzes: [
                        { question: 'Hành động lặp lại một cách vô thức?', options: ['Habit', 'Gift', 'Once', 'Flash'], correctAnswer: 'Habit', tip: 'Habit là thói quen.' },
                        { question: 'Hoạt động xem kịch, đi chơi...?', options: ['Working', 'Entertainment', 'Rest', 'Cry'], correctAnswer: 'Entertainment', tip: 'Entertainment là tiêu khiển.' },
                        { question: 'Thời gian khi không phải bận rộn?', options: ['Leisure', 'Busy', 'Hard', 'Task'], correctAnswer: 'Leisure', tip: 'Leisure là lúc rảnh.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Expense', phonetic: '/ɪkˈspens/', meaning: 'Chi tiêu', examples: ['Living expense. (Chi phí sinh hoạt.)', 'Cover the expense. (Chi trả chi phí.)', 'Reduce expenses. (Giảm chi tiêu.)'] },
                        { word: 'Investment', phonetic: '/ɪnˈvestmənt/', meaning: 'Đầu tư', examples: ['Safe investment. (Đầu tư an toàn.)', 'Return on investment. (Lợi tức đầu tư.)', 'Smart investment. (Đầu tư thông minh.)'] },
                        { word: 'Minimalist', phonetic: '/ˈmɪnɪməlɪst/', meaning: 'Người sống tối giản', examples: ['Minimalist approach. (Cách tiếp cận tối giản.)', 'Minimalist home. (Ngôi nhà tối giản.)', 'Strict minimalist. (Người tối giản triệt để.)'] },
                    ],
                    quizzes: [
                        { question: 'Các khoản tiền phải chi ra?', options: ['Gift', 'Expense', 'Loan', 'Debt'], correctAnswer: 'Expense', tip: 'Expense là chi tiêu.' },
                        { question: 'Hoạt động dùng vốn để sinh lời?', options: ['Investment', 'Hate', 'Fear', 'Loss'], correctAnswer: 'Investment', tip: 'Investment là đầu tư.' },
                        { question: 'Lối sống lược bỏ những gì dư thừa?', options: ['Minimalist', 'Crowded', 'Full', 'Old'], correctAnswer: 'Minimalist', tip: 'Minimalist là tối giản.' },
                    ]
                },
                {
                    vocab: [
                        { word: 'Sustainability', phonetic: '/səˌsteɪnəˈbɪləti/', meaning: 'Sự bền vững', examples: ['Economic sustainability. (Bền vững kinh tế.)', 'Environmental sustainability. (Bền vững môi trường.)', 'Ensure sustainability. (Đảm bảo sự bền vững.)'] },
                        { word: 'Lifestyle', phonetic: '/ˈlaɪfstaɪl/', meaning: 'Lối sống', examples: ['Modern lifestyle. (Lối sống hiện đại.)', 'Healthy lifestyle. (Lối sống lành mạnh.)', 'Change your lifestyle. (Thay đổi lối sống.)'] },
                        { word: 'Balance', phonetic: '/ˈbæləns/', meaning: 'Sự cân bằng', examples: ['Work-life balance. (Cân bằng công việc - cuộc sống.)', 'Lose balance. (Mất thăng bằng.)', 'Keep your balance. (Giữ cân bằng.)'] },
                    ],
                    quizzes: [
                        { question: 'Khả năng duy trì lâu dài không tổn hại?', options: ['Sustainability', 'Waste', 'Plastic', 'Dust'], correctAnswer: 'Sustainability', tip: 'Sustainability là bền vững.' },
                        { question: 'Cách thức một người sống và làm việc?', options: ['Lifestyle', 'Change', 'Luck', 'News'], correctAnswer: 'Lifestyle', tip: 'Lifestyle là lối sống.' },
                        { question: 'Tình trạng ổn định, không lệch lạc?', options: ['Balance', 'Fall', 'Jump', 'Side'], correctAnswer: 'Balance', tip: 'Balance là cân bằng.' },
                    ]
                },
            ]
        },
    ];

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
