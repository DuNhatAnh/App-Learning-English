
import { Lesson, LessonStatus, Activity, LessonContent } from './types';

export const MOCK_LESSONS: Lesson[] = [
  {
    id: 1,
    title: 'Greetings & Introductions',
    description: 'Cách chào hỏi và giới thiệu bản thân một cách tự nhiên trong lần đầu gặp mặt.',
    duration: 5,
    status: LessonStatus.COMPLETED
  },
  {
    id: 2,
    title: 'Dining Out & Ordering Food',
    description: 'Từ vựng và cấu trúc câu cần thiết khi đi ăn tại nhà hàng hoặc quán cà phê.',
    duration: 6,
    status: LessonStatus.COMPLETED
  },
  {
    id: 3,
    title: 'Asking for Directions',
    description: 'Cách hỏi và chỉ đường khi bạn đi du lịch hoặc lạc đường ở nơi công cộng.',
    duration: 7,
    status: LessonStatus.ACTIVE,
    progress: 30
  },
  {
    id: 4,
    title: 'Shopping & Bargaining',
    description: 'Giao tiếp khi đi mua sắm, hỏi giá cả và mặc cả khéo léo.',
    duration: 5,
    status: LessonStatus.LOCKED
  },
  {
    id: 5,
    title: 'Daily Routines & Habits',
    description: 'Mô tả các hoạt động hằng ngày và thói quen cá nhân bằng tiếng Anh.',
    duration: 8,
    status: LessonStatus.LOCKED
  }
];

export const LESSON_DETAILS: Record<number, LessonContent> = {
  1: {
    id: 1,
    sectionTitle: 'Chào hỏi & Làm quen',
    vocab: [
      { word: 'Introduce', phonetic: '/ˌɪntrəˈdjuːs/', meaning: 'Giới thiệu' },
      { word: 'Pleasure', phonetic: '/ˈpleʒə(r)/', meaning: 'Niềm hân hạnh' }
    ],
    quizQuestion: 'Khi lần đầu gặp ai đó một cách trang trọng, bạn nên nói gì?',
    quizOptions: ['How are you?', "Pleased to meet you", 'What is up?', 'See you later'],
    correctAnswer: 'Pleased to meet you',
    feedbackText: '"Pleased to meet you" là cách nói lịch sự thay cho "Nice to meet you".',
    tip: 'Trong giao tiếp thân mật, bạn có thể dùng "How is it going?" thay cho "How are you?".'
  },
  2: {
    id: 2,
    sectionTitle: 'Tại Nhà Hàng',
    vocab: [
      { word: 'Reservation', phonetic: '/ˌrezəˈveɪʃn/', meaning: 'Đặt chỗ trước' },
      { word: 'Appetizer', phonetic: '/ˈæpɪtaɪzə(r)/', meaning: 'Món khai vị' }
    ],
    quizQuestion: 'Để yêu cầu thanh toán hóa đơn, bạn nên nói gì?',
    quizOptions: ['Check, please!', 'Give me money', 'I am full', 'Food is good'],
    correctAnswer: 'Check, please!',
    feedbackText: '"Check, please!" hoặc "Could I have the bill, please?" là cách gọi thanh toán phổ biến.',
    tip: 'Ở Mỹ thường dùng "Check", ở Anh thường dùng "Bill".'
  },
  3: {
    id: 3,
    sectionTitle: 'Hỏi & Chỉ Đường',
    vocab: [
      { word: 'Intersection', phonetic: '/ˌɪntəˈsekʃn/', meaning: 'Ngã tư' },
      { word: 'Destination', phonetic: '/ˌdestɪˈneɪʃn/', meaning: 'Điểm đến' }
    ],
    quizQuestion: 'Cấu trúc nào dùng để hỏi đường một cách lịch sự?',
    quizOptions: ['Where is it?', 'Go away!', 'Could you tell me the way to...', 'Tell me now'],
    correctAnswer: 'Could you tell me the way to...',
    feedbackText: 'Bắt đầu bằng "Excuse me" trước khi hỏi đường sẽ giúp bạn trông lịch sự hơn.',
    tip: 'Cụm từ "Go straight" nghĩa là đi thẳng, "Turn left/right" là rẽ trái/phải.'
  },
  4: {
    id: 4,
    sectionTitle: 'Mua Sắm',
    vocab: [
      { word: 'Discount', phonetic: '/ˈdɪskaʊnt/', meaning: 'Giảm giá' },
      { word: 'Fitting room', phonetic: '/ˈfɪtɪŋ ruːm/', meaning: 'Phòng thử đồ' }
    ],
    quizQuestion: 'Bạn nói gì khi muốn thử một chiếc áo?',
    quizOptions: ['I want this', 'Can I try this on?', 'Give me size L', 'Is it cheap?'],
    correctAnswer: 'Can I try this on?',
    feedbackText: '"Try something on" là cụm động từ dùng cho việc thử quần áo.',
    tip: 'Hỏi "Does it come in other colors?" nếu bạn muốn tìm màu khác của sản phẩm.'
  },
  5: {
    id: 5,
    sectionTitle: 'Thói Quen Hằng Ngày',
    vocab: [
      { word: 'Commute', phonetic: '/kəˈmjuːt/', meaning: 'Đi làm/học xa' },
      { word: 'Unwind', phonetic: '/ˌʌnˈwaɪnd/', meaning: 'Thư giãn' }
    ],
    quizQuestion: 'Từ nào dùng để chỉ việc di chuyển hằng ngày từ nhà đến nơi làm việc?',
    quizOptions: ['Travel', 'Commute', 'Walk', 'Run'],
    correctAnswer: 'Commute',
    feedbackText: '"Commute" chỉ việc đi lại đều đặn giữa nhà và nơi làm việc.',
    tip: 'Dùng "I usually..." để mô tả những thói quen lặp đi lặp lại hằng ngày.'
  }
};

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    title: 'Hoàn thành bài tập "Chào hỏi"',
    timestamp: '2 giờ trước',
    type: 'success'
  },
  {
    id: '2',
    title: 'Luyện phát âm từ "Reservation"',
    timestamp: 'Hôm qua, 15:30',
    type: 'primary'
  },
  {
    id: '3',
    title: 'Đạt 10/10 điểm thử thách "Hỏi đường"',
    timestamp: '20/10/2023',
    type: 'warning'
  }
];
