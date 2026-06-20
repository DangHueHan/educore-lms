import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Clearing old data...');

  // Xóa dữ liệu cũ theo thứ tự tránh lỗi ràng buộc khóa ngoại
  await prisma.quizResultDetail.deleteMany();
  await prisma.quizResult.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.lessonProgress.deleteMany(); 
  await prisma.lesson.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.courseProgress.deleteMany();
  await prisma.courseReview.deleteMany();    
  await prisma.payment.deleteMany();         
  await prisma.courseCoupon.deleteMany();    
  await prisma.coupon.deleteMany();          
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  console.log('🌱 Seeding realistic data...');

  // ================= 1. USERS (5)
  await prisma.user.createMany({
    data: [
      { id: 'user-1', email: 'admin@example.com', displayName: 'Admin System', role: 'admin' },
      { id: 'user-2', email: 'student1@example.com', displayName: 'Nguyễn Văn Định', role: 'user' },
      { id: 'user-3', email: 'student2@example.com', displayName: 'Trần Thị Bảo Hoàng', role: 'user' },
      { id: 'user-4', email: 'student3@example.com', displayName: 'Lê Hoàng Minh Cường', role: 'user' },
      { id: 'user-5', email: 'student4@example.com', displayName: 'Phạm Hồng Dung', role: 'user' },
    ],
  });

  // ================= 2. COURSES DATA WITH ALL 10 QUESTIONS PER COURSE
  const coursesData = [
    {
      id: 'course-1',
      title: 'JavaScript Cơ Bản',
      description: 'Học Javascript nền tảng vững chắc, từ biến, hàm cho đến xử lý bất đồng bộ trong thực tế.',
      price: 499000,
      lessons: [
        { id: 'les-c1-1', title: 'Lesson 1: Giới thiệu về JS và Biến', videoUrl: 'https://www.youtube.com/embed/dQw4w9wgXcQ' },
        { id: 'les-c1-2', title: 'Lesson 2: Hàm và Mạng trong Javascript', videoUrl: 'https://www.youtube.com/embed/dQw4w9wgXcQ' },
        { id: 'les-c1-3', title: 'Lesson 3: Xử lý Bất đồng bộ với Async/Await', videoUrl: 'https://www.youtube.com/embed/dQw4w9wgXcQ' },
      ],
      questions: [
        {
          id: 'que-c1-1',
          question: 'Từ khóa nào dùng để khai báo một biến có thể gán lại giá trị trong JS?',
          answers: [
            { id: 'ans-c1-1-1', text: 'let', isCorrect: true },
            { id: 'ans-c1-1-2', text: 'const', isCorrect: false },
            { id: 'ans-c1-1-3', text: 'static', isCorrect: false },
            { id: 'ans-c1-1-4', text: 'immutable', isCorrect: false }
          ]
        },
        {
          id: 'que-c1-2',
          question: 'Kết quả của biểu thức "5" + 2 trong JavaScript là gì?',
          answers: [
            { id: 'ans-c1-2-1', text: '"52"', isCorrect: true },
            { id: 'ans-c1-2-2', text: '7', isCorrect: false },
            { id: 'ans-c1-2-3', text: 'NaN', isCorrect: false },
            { id: 'ans-c1-2-4', text: 'Undefined', isCorrect: false }
          ]
        },
        {
          id: 'que-c1-3',
          question: 'Hàm nào dùng để chuyển đổi một chuỗi JSON thành một đối tượng JS?',
          answers: [
            { id: 'ans-c1-3-1', text: 'JSON.parse()', isCorrect: true },
            { id: 'ans-c1-3-2', text: 'JSON.stringify()', isCorrect: false },
            { id: 'ans-c1-3-3', text: 'JSON.object()', isCorrect: false },
            { id: 'ans-c1-3-4', text: 'JSON.toObject()', isCorrect: false }
          ]
        },
        {
          id: 'que-c1-4',
          question: 'Phương thức mảng nào dùng để lọc ra các phần tử thỏa mãn điều kiện?',
          answers: [
            { id: 'ans-c1-4-1', text: 'filter()', isCorrect: true },
            { id: 'ans-c1-4-2', text: 'map()', isCorrect: false },
            { id: 'ans-c1-4-3', text: 'reduce()', isCorrect: false },
            { id: 'ans-c1-4-4', text: 'find()', isCorrect: false }
          ]
        },
        {
          id: 'que-c1-5',
          question: 'Đâu không phải là một trạng thái của một Promise?',
          answers: [
            { id: 'ans-c1-5-1', text: 'processing', isCorrect: true },
            { id: 'ans-c1-5-2', text: 'pending', isCorrect: false },
            { id: 'ans-c1-5-3', text: 'fulfilled', isCorrect: false },
            { id: 'ans-c1-5-4', text: 'rejected', isCorrect: false }
          ]
        },
        {
          id: 'que-c1-6',
          question: 'Toán tử so sánh nghiêm ngặt (kiểm tra cả giá trị và kiểu dữ liệu) là toán tử nào?',
          answers: [
            { id: 'ans-c1-6-1', text: '===', isCorrect: true },
            { id: 'ans-c1-6-2', text: '==', isCorrect: false },
            { id: 'ans-c1-6-3', text: '=', isCorrect: false },
            { id: 'ans-c1-6-4', text: '!=', isCorrect: false }
          ]
        },
        {
          id: 'que-c1-7',
          question: 'Lệnh "typeof null" trả về giá trị gì?',
          answers: [
            { id: 'ans-c1-7-1', text: '"object"', isCorrect: true },
            { id: 'ans-c1-7-2', text: '"null"', isCorrect: false },
            { id: 'ans-c1-7-3', text: '"undefined"', isCorrect: false },
            { id: 'ans-c1-7-4', text: '"number"', isCorrect: false }
          ]
        },
        {
          id: 'que-c1-8',
          question: 'Sự kiện DOM nào kích hoạt khi người dùng click chuột vào một phần tử?',
          answers: [
            { id: 'ans-c1-8-1', text: 'onclick', isCorrect: true },
            { id: 'ans-c1-8-2', text: 'onhover', isCorrect: false },
            { id: 'ans-c1-8-3', text: 'onchange', isCorrect: false },
            { id: 'ans-c1-8-4', text: 'onsubmit', isCorrect: false }
          ]
        },
        {
          id: 'que-c1-9',
          question: 'Phương thức nào thêm một phần tử vào cuối mảng?',
          answers: [
            { id: 'ans-c1-9-1', text: 'push()', isCorrect: true },
            { id: 'ans-c1-9-2', text: 'pop()', isCorrect: false },
            { id: 'ans-c1-9-3', text: 'shift()', isCorrect: false },
            { id: 'ans-c1-9-4', text: 'unshift()', isCorrect: false }
          ]
        },
        {
          id: 'que-c1-10',
          question: 'Mục đích chính của "use strict" trong file JS là gì?',
          answers: [
            { id: 'ans-c1-10-1', text: 'Bắt buộc code tuân thủ các quy tắc nghiêm ngặt để tránh lỗi ẩn', isCorrect: true },
            { id: 'ans-c1-10-2', text: 'Làm code chạy nhanh hơn gấp đôi', isCorrect: false },
            { id: 'ans-c1-10-3', text: 'Mã hóa code bảo mật', isCorrect: false },
            { id: 'ans-c1-10-4', text: 'Ngắt kết nối cơ sở dữ liệu lỗi', isCorrect: false }
          ]
        }
      ]
    },
    {
      id: 'course-2',
      title: 'React.js Từ A đến Z',
      description: 'Học cách xây dựng Single Page Application mạnh mẽ với Virtual DOM, State, Hooks và Props.',
      price: 799000,
      lessons: [
        { id: 'les-c2-1', title: 'Lesson 1: Khởi động dự án với Vite và Component', videoUrl: 'https://www.youtube.com/embed/dQw4w9wgXcQ' },
        { id: 'les-c2-2', title: 'Lesson 2: Quản lý State bằng useState và useEffect', videoUrl: 'https://www.youtube.com/embed/dQw4w9wgXcQ' },
        { id: 'les-c2-3', title: 'Lesson 3: Tối ưu hiệu năng ứng dụng React', videoUrl: 'https://www.youtube.com/embed/dQw4w9wgXcQ' },
      ],
      questions: [
        {
          id: 'que-c2-1',
          question: 'ReactJS là một thư viện dùng để phát triển thành phần nào của ứng dụng?',
          answers: [
            { id: 'ans-c2-1-1', text: 'Frontend (Giao diện người dùng)', isCorrect: true },
            { id: 'ans-c2-1-2', text: 'Backend (Cơ sở dữ liệu)', isCorrect: false },
            { id: 'ans-c2-1-3', text: 'Mobile OS (Hệ điều hành)', isCorrect: false },
            { id: 'ans-c2-1-4', text: 'DevOps pipeline', isCorrect: false }
          ]
        },
        {
          id: 'que-c2-2',
          question: 'Hook nào dùng để quản lý trạng thái cục bộ trong một Functional Component?',
          answers: [
            { id: 'ans-c2-2-1', text: 'useState', isCorrect: true },
            { id: 'ans-c2-2-2', text: 'useEffect', isCorrect: false },
            { id: 'ans-c2-2-3', text: 'useContext', isCorrect: false },
            { id: 'ans-c2-2-4', text: 'useReducer', isCorrect: false }
          ]
        },
        {
          id: 'que-c2-3',
          question: 'Cú pháp mở rộng viết mã HTML trực tiếp trong file JavaScript của React gọi là gì?',
          answers: [
            { id: 'ans-c2-3-1', text: 'JSX', isCorrect: true },
            { id: 'ans-c2-3-2', text: 'XML', isCorrect: false },
            { id: 'ans-c2-3-3', text: 'JS-HTML', isCorrect: false },
            { id: 'ans-c2-3-4', text: 'V-DOM', isCorrect: false }
          ]
        },
        {
          id: 'que-c2-4',
          question: 'Khi truyền dữ liệu từ Component cha xuống Component con, ta sử dụng khái niệm nào?',
          answers: [
            { id: 'ans-c2-4-1', text: 'Props', isCorrect: true },
            { id: 'ans-c2-4-2', text: 'State', isCorrect: false },
            { id: 'ans-c2-4-3', text: 'Redux', isCorrect: false },
            { id: 'ans-c2-4-4', text: 'Route', isCorrect: false }
          ]
        },
        {
          id: 'que-c2-5',
          question: 'Hook nào tương ứng với các vòng đời (lifecycle) như componentDidMount và componentDidUpdate?',
          answers: [
            { id: 'ans-c2-5-1', text: 'useEffect', isCorrect: true },
            { id: 'ans-c2-5-2', text: 'useMemo', isCorrect: false },
            { id: 'ans-c2-5-3', text: 'useCallback', isCorrect: false },
            { id: 'ans-c2-5-4', text: 'useRef', isCorrect: false }
          ]
        },
        {
          id: 'que-c2-6',
          question: 'Thuộc tính bắt buộc phải thêm khi render một danh sách các phần tử bằng hàm map() là gì?',
          answers: [
            { id: 'ans-c2-6-1', text: 'key', isCorrect: true },
            { id: 'ans-c2-6-2', text: 'id', isCorrect: false },
            { id: 'ans-c2-6-3', text: 'index', isCorrect: false },
            { id: 'ans-c2-6-4', text: 'className', isCorrect: false }
          ]
        },
        {
          id: 'que-c2-7',
          question: 'Làm thế nào để ngăn chặn một Component re-render không cần thiết khi dữ liệu không đổi?',
          answers: [
            { id: 'ans-c2-7-1', text: 'Bọc component bằng React.memo()', isCorrect: true },
            { id: 'ans-c2-7-2', text: 'Sử dụng thẻ async', isCorrect: false },
            { id: 'ans-c2-7-3', text: 'Sử dụng thẻ <div> thay cho <Fragment>', isCorrect: false },
            { id: 'ans-c2-7-4', text: 'Xóa hoàn toàn useEffect', isCorrect: false }
          ]
        },
        {
          id: 'que-c2-8',
          question: 'Để lưu trữ một tham chiếu không làm thay đổi giao diện (re-render) khi cập nhật, ta dùng Hook nào?',
          answers: [
            { id: 'ans-c2-8-1', text: 'useRef', isCorrect: true },
            { id: 'ans-c2-8-2', text: 'useState', isCorrect: false },
            { id: 'ans-c2-8-3', text: 'useLayoutEffect', isCorrect: false },
            { id: 'ans-c2-8-4', text: 'useImperativeHandle', isCorrect: false }
          ]
        },
        {
          id: 'que-c2-9',
          question: 'Trong React, "Virtual DOM" cập nhật thật sự vào Browser DOM thông qua quy trình nào?',
          answers: [
            { id: 'ans-c2-9-1', text: 'Reconciliation (Đối sánh diffing)', isCorrect: true },
            { id: 'ans-c2-9-2', text: 'Server Side Rendering', isCorrect: false },
            { id: 'ans-c2-9-3', text: 'Garbage Collection', isCorrect: false },
            { id: 'ans-c2-9-4', text: 'Bundling', isCorrect: false }
          ]
        },
        {
          id: 'que-c2-10',
          question: 'Thư viện phổ biến dùng để quản lý định tuyến (Routing) trong React là gì?',
          answers: [
            { id: 'ans-c2-10-1', text: 'React Router', isCorrect: true },
            { id: 'ans-c2-10-2', text: 'Redux Thunk', isCorrect: false },
            { id: 'ans-c2-10-3', text: 'Axios', isCorrect: false },
            { id: 'ans-c2-10-4', text: 'NextAuth', isCorrect: false }
          ]
        }
      ]
    },
    {
      id: 'course-3',
      title: 'UI/UX Design Fundamentals',
      description: 'Nắm vững tư duy thiết kế lấy người dùng làm trung tâm, quy tắc phân cấp thị giác và Wireframing.',
      price: 299000,
      lessons: [
        { id: 'les-c3-1', title: 'Lesson 1: Định nghĩa UI và UX trong Kỹ nghệ phần mềm', videoUrl: 'https://www.youtube.com/embed/dQw4w9wgXcQ' },
        { id: 'les-c3-2', title: 'Lesson 2: Quy tắc Thiết kế Typography và Color Palette', videoUrl: 'https://www.youtube.com/embed/dQw4w9wgXcQ' },
        { id: 'les-c3-3', title: 'Lesson 3: Tạo Prototype tương tác cao trên Figma', videoUrl: 'https://www.youtube.com/embed/dQw4w9wgXcQ' },
      ],
      questions: [
        {
          id: 'que-c3-1',
          question: 'UX là viết tắt của cụm từ tiếng Anh nào?',
          answers: [
            { id: 'ans-c3-1-1', text: 'User Experience', isCorrect: true },
            { id: 'ans-c3-1-2', text: 'User Expert', isCorrect: false },
            { id: 'ans-c3-1-3', text: 'Universal X-platform', isCorrect: false },
            { id: 'ans-c3-1-4', text: 'Unique Utility', isCorrect: false }
          ]
        },
        {
          id: 'que-c3-2',
          question: 'Quy trình tạo bản phác thảo cấu trúc thô (đen trắng) của màn hình gọi là gì?',
          answers: [
            { id: 'ans-c3-2-1', text: 'Wireframing', isCorrect: true },
            { id: 'ans-c3-2-2', text: 'High-fidelity Prototyping', isCorrect: false },
            { id: 'ans-c3-2-3', text: 'Color Grading', isCorrect: false },
            { id: 'ans-c3-2-4', text: 'User Persona Mapping', isCorrect: false }
          ]
        },
        {
          id: 'que-c3-3',
          question: 'Khoảng cách trống bao quanh các phần tử thiết kế giúp giao diện thoáng đãng gọi là gì?',
          answers: [
            { id: 'ans-c3-3-1', text: 'White Space / Negative Space', isCorrect: true },
            { id: 'ans-c3-3-2', text: 'Grid Line', isCorrect: false },
            { id: 'ans-c3-3-3', text: 'Padding Block', isCorrect: false },
            { id: 'ans-c3-3-4', text: 'Margin Collapse', isCorrect: false }
          ]
        },
        {
          id: 'que-c3-4',
          question: 'Công cụ thiết kế giao diện UI/UX chạy trên nền tảng Web phổ biến nhất hiện nay?',
          answers: [
            { id: 'ans-c3-4-1', text: 'Figma', isCorrect: true },
            { id: 'ans-c3-4-2', text: 'Adobe Photoshop', isCorrect: false },
            { id: 'ans-c3-4-3', text: 'Eclipse', isCorrect: false },
            { id: 'ans-c3-4-4', text: 'MS Paint', isCorrect: false }
          ]
        },
        {
          id: 'que-c3-5',
          question: 'Yếu tố nào giúp dẫn dắt mắt người dùng đọc thông tin quan trọng trước dựa vào độ lớn, màu sắc chữ?',
          answers: [
            { id: 'ans-c3-5-1', text: 'Visual Hierarchy (Phân cấp thị giác)', isCorrect: true },
            { id: 'ans-c3-5-2', text: 'Symmetry (Sự đối xứng)', isCorrect: false },
            { id: 'ans-c3-5-3', text: 'Responsive design', isCorrect: false },
            { id: 'ans-c3-5-4', text: 'Affordance', isCorrect: false }
          ]
        },
        {
          id: 'que-c3-6',
          question: 'Một nút bấm (Button) có đổ bóng nhẹ tạo cảm giác nổi lên để click được gọi là áp dụng nguyên lý nào?',
          answers: [
            { id: 'ans-c3-6-1', text: 'Affordance (Khả năng gợi ý công dụng)', isCorrect: true },
            { id: 'ans-c3-6-2', text: 'Consistency', isCorrect: false },
            { id: 'ans-c3-6-3', text: 'Accessibility', isCorrect: false },
            { id: 'ans-c3-6-4', text: 'Mapping', isCorrect: false }
          ]
        },
        {
          id: 'que-c3-7',
          question: 'Kiểm thử sản phẩm bằng cách cho người dùng trực tiếp thao tác và theo dõi khó khăn của họ gọi là gì?',
          answers: [
            { id: 'ans-c3-7-1', text: 'Usability Testing', isCorrect: true },
            { id: 'ans-c3-7-2', text: 'Unit Testing', isCorrect: false },
            { id: 'ans-c3-7-3', text: 'Stress Testing', isCorrect: false },
            { id: 'ans-c3-7-4', text: 'Integration Testing', isCorrect: false }
          ]
        },
        {
          id: 'que-c3-8',
          question: 'Màu sắc chủ đạo trong một sản phẩm thường chiếm bao nhiêu phần trăm theo quy tắc 60-30-10?',
          answers: [
            { id: 'ans-c3-8-1', text: '60%', isCorrect: true },
            { id: 'ans-c3-8-2', text: '30%', isCorrect: false },
            { id: 'ans-c3-8-3', text: '10%', isCorrect: false },
            { id: 'ans-c3-8-4', text: '100%', isCorrect: false }
          ]
        },
        {
          id: 'que-c3-9',
          question: '"Chỉ số đo lường mức độ người dùng rời bỏ ứng dụng sau một thời gian ngắn sử dụng" gọi là gì?',
          answers: [
            { id: 'ans-c3-9-1', text: 'Churn Rate', isCorrect: true },
            { id: 'ans-c3-9-2', text: 'Conversion Rate', isCorrect: false },
            { id: 'ans-c3-9-3', text: 'Click Through Rate', isCorrect: false },
            { id: 'ans-c3-9-4', text: 'Retention Rate', isCorrect: false }
          ]
        },
        {
          id: 'que-c3-10',
          question: 'Khi thiết kế nút bấm trên di động, kích thước vùng chạm tối thiểu khuyến nghị của Google/Apple để tránh bấm nhầm là bao nhiêu?',
          answers: [
            { id: 'ans-c3-10-1', text: '44x44 dp / 48x48 dp', isCorrect: true },
            { id: 'ans-c3-10-2', text: '10x10 dp', isCorrect: false },
            { id: 'ans-c3-10-3', text: '120x120 dp', isCorrect: false },
            { id: 'ans-c3-10-4', text: '24x24 dp', isCorrect: false }
          ]
        }
      ]
    },
    {
      id: 'course-4',
      title: 'Node.js & Backend',
      description: 'Làm chủ phía server, kiến trúc RESTful API, tương tác DB và cơ chế Event Loop đặc trưng.',
      price: 599000,
      lessons: [
        { id: 'les-c4-1', title: 'Lesson 1: Tổng quan về Node.js Runtime và V8 Engine', videoUrl: 'https://www.youtube.com/embed/dQw4w9wgXcQ' },
        { id: 'les-c4-2', title: 'Lesson 2: Xây dựng REST API với ExpressJS', videoUrl: 'https://www.youtube.com/embed/dQw4w9wgXcQ' },
        { id: 'les-c4-3', title: 'Lesson 3: Kết nối cơ sở dữ liệu và bảo mật với JWT', videoUrl: 'https://www.youtube.com/embed/dQw4w9wgXcQ' },
      ],
      questions: [
        {
          id: 'que-c4-1',
          question: 'Node.js bản chất thực sự là gì?',
          answers: [
            { id: 'ans-c4-1-1', text: 'Môi trường thực thi JavaScript (JavaScript Runtime)', isCorrect: true },
            { id: 'ans-c4-1-2', text: 'Một ngôn ngữ lập trình hoàn toàn mới', isCorrect: false },
            { id: 'ans-c4-1-3', text: 'Một Web Browser', isCorrect: false },
            { id: 'ans-c4-1-4', text: 'Một Hệ quản trị cơ sở dữ liệu', isCorrect: false }
          ]
        },
        {
          id: 'que-c4-2',
          question: 'Cơ chế cốt lõi giúp Node.js xử lý hàng nghìn kết nối đồng thời với cấu trúc đơn luồng (Single-thread) là gì?',
          answers: [
            { id: 'ans-c4-2-1', text: 'Event Loop và Non-blocking I/O', isCorrect: true },
            { id: 'ans-c4-2-2', text: 'Multi-threading ảo hóa', isCorrect: false },
            { id: 'ans-c4-2-3', text: 'Đồng bộ hóa dữ liệu trực tiếp', isCorrect: false },
            { id: 'ans-c4-2-4', text: 'Sử dụng RAM làm bộ nhớ đệm luồng', isCorrect: false }
          ]
        },
        {
          id: 'que-c4-3',
          question: 'Phương thức HTTP nào được khuyến nghị để cập nhật một phần dữ liệu của bản ghi?',
          answers: [
            { id: 'ans-c4-3-1', text: 'PATCH', isCorrect: true },
            { id: 'ans-c4-3-2', text: 'PUT', isCorrect: false },
            { id: 'ans-c4-3-3', text: 'POST', isCorrect: false },
            { id: 'ans-c4-3-4', text: 'GET', isCorrect: false }
          ]
        },
        {
          id: 'que-c4-4',
          question: 'Mã trạng thái HTTP (Status Code) nào đại diện cho lỗi Không tìm thấy tài nguyên (Not Found)?',
          answers: [
            { id: 'ans-c4-4-1', text: '404', isCorrect: true },
            { id: 'ans-c4-4-2', text: '500', isCorrect: false },
            { id: 'ans-c4-4-3', text: '401', isCorrect: false },
            { id: 'ans-c4-4-4', text: '200', isCorrect: false }
          ]
        },
        {
          id: 'que-c4-5',
          question: 'Framework tối giản phổ biến nhất của Node.js để tạo HTTP Server và định tuyến Router là gì?',
          answers: [
            { id: 'ans-c4-5-1', text: 'Express.js', isCorrect: true },
            { id: 'ans-c4-5-2', text: 'Angular', isCorrect: false },
            { id: 'ans-c4-5-3', text: 'Vue.js', isCorrect: false },
            { id: 'ans-c4-5-4', text: 'Prisma Client', isCorrect: false }
          ]
        },
        {
          id: 'que-c4-6',
          question: 'Trong Express, các hàm chạy trung gian nằm giữa Request và Response dùng để kiểm tra đăng nhập/xử lý lỗi gọi là gì?',
          answers: [
            { id: 'ans-c4-6-1', text: 'Middleware', isCorrect: true },
            { id: 'ans-c4-6-2', text: 'Controller', isCorrect: false },
            { id: 'ans-c4-6-3', text: 'Model View', isCorrect: false },
            { id: 'ans-c4-6-4', text: 'Repository', isCorrect: false }
          ]
        },
        {
          id: 'que-c4-7',
          question: 'Để băm (hash) mật khẩu của người dùng an toàn trước khi lưu vào DB, thư viện nào được khuyên dùng?',
          answers: [
            { id: 'ans-c4-7-1', text: 'bcrypt', isCorrect: true },
            { id: 'ans-c4-7-2', text: 'jsonwebtoken', isCorrect: false },
            { id: 'ans-c4-7-3', text: 'dotenv', isCorrect: false },
            { id: 'ans-c4-7-4', text: 'nodemailer', isCorrect: false }
          ]
        },
        {
          id: 'que-c4-8',
          question: 'JWT (JSON Web Token) gồm có bao nhiêu phần được phân tách bằng dấu chấm (.)?',
          answers: [
            { id: 'ans-c4-8-1', text: '3 phần (Header, Payload, Signature)', isCorrect: true },
            { id: 'ans-c4-8-2', text: '2 phần', isCorrect: false },
            { id: 'ans-c4-8-3', text: '4 phần', isCorrect: false },
            { id: 'ans-c4-8-4', text: '5 phần', isCorrect: false }
          ]
        },
        {
          id: 'que-c4-9',
          question: 'Thư viện/Công cụ quản lý gói mặc định đi kèm khi cài đặt Node.js là gì?',
          answers: [
            { id: 'ans-c4-9-1', text: 'npm', isCorrect: true },
            { id: 'ans-c4-9-2', text: 'yarn', isCorrect: false },
            { id: 'ans-c4-9-3', text: 'pnpm', isCorrect: false },
            { id: 'ans-c4-9-4', text: 'composer', isCorrect: false }
          ]
        },
        {
          id: 'que-c4-10',
          question: 'Biến toàn cục nào chứa các tham số cấu hình môi trường hệ thống trong Node.js?',
          answers: [
            { id: 'ans-c4-10-1', text: 'process.env', isCorrect: true },
            { id: 'ans-c4-10-2', text: 'window.env', isCorrect: false },
            { id: 'ans-c4-10-3', text: 'global.config', isCorrect: false },
            { id: 'ans-c4-10-4', text: 'document.env', isCorrect: false }
          ]
        }
      ]
    },
    {
      id: 'course-5',
      title: 'Python cho Data Science',
      description: 'Làm quen ngôn ngữ Python, thao tác xử lý dữ liệu bảng với Pandas và trực quan hóa dữ liệu.',
      price: 699000,
      lessons: [
        { id: 'les-c5-1', title: 'Lesson 1: Cấu trúc dữ liệu List, Tuple, Dictionary trong Python', videoUrl: 'https://www.youtube.com/embed/dQw4w9wgXcQ' },
        { id: 'les-c5-2', title: 'Lesson 2: Phân tích và làm sạch dữ liệu bằng Pandas DataFrame', videoUrl: 'https://www.youtube.com/embed/dQw4w9wgXcQ' },
        { id: 'les-c5-3', title: 'Lesson 3: Trực quan biểu đồ với Matplotlib và Seaborn', videoUrl: 'https://www.youtube.com/embed/dQw4w9wgXcQ' },
      ],
      questions: [
        {
          id: 'que-c5-1',
          question: 'Kiểu dữ liệu nào trong Python là danh sách có thứ tự nhưng KHÔNG THỂ chỉnh sửa (immutable)?',
          answers: [
            { id: 'ans-c5-1-1', text: 'Tuple', isCorrect: true },
            { id: 'ans-c5-1-2', text: 'List', isCorrect: false },
            { id: 'ans-c5-1-3', text: 'Dictionary', isCorrect: false },
            { id: 'ans-c5-1-4', text: 'Set', isCorrect: false }
          ]
        },
        {
          id: 'que-c5-2',
          question: 'Thư viện cốt lõi chuyên dùng để xử lý mảng nhiều chiều và tính toán đại số tuyến tính tốc độ cao là gì?',
          answers: [
            { id: 'ans-c5-2-1', text: 'NumPy', isCorrect: true },
            { id: 'ans-c5-2-2', text: 'Pandas', isCorrect: false },
            { id: 'ans-c5-2-3', text: 'Django', isCorrect: false },
            { id: 'ans-c5-2-4', text: 'Flask', isCorrect: false }
          ]
        },
        {
          id: 'que-c5-3',
          question: 'Cấu trúc dữ liệu dạng bảng 2 chiều gồm hàng và cột trong thư viện Pandas gọi là gì?',
          answers: [
            { id: 'ans-c5-3-1', text: 'DataFrame', isCorrect: true },
            { id: 'ans-c5-3-2', text: 'Series', isCorrect: false },
            { id: 'ans-c5-3-3', text: 'Matrix-Data', isCorrect: false },
            { id: 'ans-c5-3-4', text: 'DataList', isCorrect: false }
          ]
        },
        {
          id: 'que-c5-4',
          question: 'Hàm nào trong Pandas dùng để xem 5 dòng đầu tiên của một tập dữ liệu?',
          answers: [
            { id: 'ans-c5-4-1', text: 'head()', isCorrect: true },
            { id: 'ans-c5-4-2', text: 'tail()', isCorrect: false },
            { id: 'ans-c5-4-3', text: 'info()', isCorrect: false },
            { id: 'ans-c5-4-4', text: 'describe()', isCorrect: false }
          ]
        },
        {
          id: 'que-c5-5',
          question: 'Để loại bỏ các giá trị bị khuyết/rỗng (NaN) trong bảng dữ liệu Pandas, ta dùng phương thức nào?',
          answers: [
            { id: 'ans-c5-5-1', text: 'dropna()', isCorrect: true },
            { id: 'ans-c5-5-2', text: 'fillna()', isCorrect: false },
            { id: 'ans-c5-5-3', text: 'clear()', isCorrect: false },
            { id: 'ans-c5-5-4', text: 'remove_null()', isCorrect: false }
          ]
        },
        {
          id: 'que-c5-6',
          question: 'Đâu là thư viện dùng để vẽ biểu đồ và trực quan hóa dữ liệu cơ bản trong Python?',
          answers: [
            { id: 'ans-c5-6-1', text: 'Matplotlib', isCorrect: true },
            { id: 'ans-c5-6-2', text: 'Scikit-learn', isCorrect: false },
            { id: 'ans-c5-6-3', text: 'PyTorch', isCorrect: false },
            { id: 'ans-c5-6-4', text: 'TensorFlow', isCorrect: false }
          ]
        },
        {
          id: 'que-c5-7',
          question: 'Để định nghĩa một hàm tự chế trong Python, bạn bắt đầu bằng từ khóa nào?',
          answers: [
            { id: 'ans-c5-7-1', text: 'def', isCorrect: true },
            { id: 'ans-c5-7-2', text: 'function', isCorrect: false },
            { id: 'ans-c5-7-3', text: 'func', isCorrect: false },
            { id: 'ans-c5-7-4', text: 'define', isCorrect: false }
          ]
        },
        {
          id: 'que-c5-8',
          question: 'Khối lệnh nào dùng để xử lý ngoại lệ (bắt lỗi) để ứng dụng không bị crash trong Python?',
          answers: [
            { id: 'ans-c5-8-1', text: 'try ... except', isCorrect: true },
            { id: 'ans-c5-8-2', text: 'try ... catch', isCorrect: false },
            { id: 'ans-c5-8-3', text: 'throw ... catch', isCorrect: false },
            { id: 'ans-c5-8-4', text: 'error ... rescue', isCorrect: false }
          ]
        },
        {
          id: 'que-c5-9',
          question: 'Cách lấy độ dài của một List có tên là my_list trong Python?',
          answers: [
            { id: 'ans-c5-9-1', text: 'len(my_list)', isCorrect: true },
            { id: 'ans-c5-9-2', text: 'my_list.length()', isCorrect: false },
            { id: 'ans-c5-9-3', text: 'my_list.size()', isCorrect: false },
            { id: 'ans-c5-9-4', text: 'count(my_list)', isCorrect: false }
          ]
        },
        {
          id: 'que-c5-10',
          question: 'Thuật toán Linear Regression thuộc nhóm học máy (Machine Learning) nào?',
          answers: [
            { id: 'ans-c5-10-1', text: 'Supervised Learning (Học có giám sát)', isCorrect: true },
            { id: 'ans-c5-10-2', text: 'Unsupervised Learning (Học không giám sát)', isCorrect: false },
            { id: 'ans-c5-10-3', text: 'Reinforcement Learning (Học tăng cường)', isCorrect: false },
            { id: 'ans-c5-10-4', text: 'Semi-supervised Learning', isCorrect: false }
          ]
        }
      ]
    }
  ];

  // Chèn Khóa học, Bài học, Câu hỏi và Câu trả lời mẫu
  for (const c of coursesData) {
    await prisma.course.create({
      data: {
        id: c.id,
        title: c.title,
        description: c.description,
        price: c.price,
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
      },
    });

    await prisma.lesson.createMany({
      data: c.lessons.map(l => ({ id: l.id, courseId: c.id, title: l.title, videoUrl: l.videoUrl }))
    });

    await prisma.question.createMany({
      data: c.questions.map(q => ({ id: q.id, courseId: c.id, question: q.question }))
    });

    for (const q of c.questions) {
      await prisma.answer.createMany({
        data: q.answers.map(a => ({ id: a.id, questionId: q.id, text: a.text, isCorrect: a.isCorrect }))
      });
    }
  }

  // ================= 3. KHỚP MỚI: ĐỔ DỮ LIỆU ĐÚNG SCHEMA CHO COUPON
  await prisma.coupon.createMany({
    data: [
      { 
        id: 'coupon-99k', 
        code: 'CHAOHE2026', 
        discountPercent: 10, 
        quantity: 100, 
        startDate: new Date('2026-01-01'), 
        endDate: new Date('2026-12-31') 
      },
      { 
        id: 'coupon-vip', 
        code: 'PROVIP', 
        discountPercent: 20, 
        quantity: 50, 
        startDate: new Date('2026-01-01'), 
        endDate: new Date('2026-12-31') 
      }
    ]
  });

  await prisma.courseCoupon.createMany({
    data: [
      { courseId: 'course-1', couponId: 'coupon-99k' },
      { courseId: 'course-2', couponId: 'coupon-vip' }
    ]
  });

  // ================= 4. ENROLLMENTS & PROGRESS & QUIZ RESULTS (Tính theo thang 10 câu hỏi)
  const enrollData = [
    { userId: 'user-2', courseId: 'course-1', progress: 100, lastLessonId: 'les-c1-3', correctAnswers: 9, completedLessons: ['les-c1-1', 'les-c1-2', 'les-c1-3'] },
    { userId: 'user-2', courseId: 'course-2', progress: 65,  lastLessonId: 'les-c2-2', correctAnswers: 7, completedLessons: ['les-c2-1', 'les-c2-2'] },
    { userId: 'user-3', courseId: 'course-1', progress: 45,  lastLessonId: 'les-c1-1', correctAnswers: 6, completedLessons: ['les-c1-1'] },
    { userId: 'user-3', courseId: 'course-3', progress: 100, lastLessonId: 'les-c3-3', correctAnswers: 4, completedLessons: ['les-c3-1', 'les-c3-2', 'les-c3-3'] },
    { userId: 'user-4', courseId: 'course-2', progress: 30,  lastLessonId: 'les-c2-1', correctAnswers: null, completedLessons: ['les-c2-1'] },
    { userId: 'user-5', courseId: 'course-4', progress: 80,  lastLessonId: 'les-c4-2', correctAnswers: 8, completedLessons: ['les-c4-1', 'les-c4-2'] },
    { userId: 'user-5', courseId: 'course-5', progress: 55,  lastLessonId: 'les-c5-2', correctAnswers: 5, completedLessons: ['les-c5-1', 'les-c5-2'] },
  ];

  for (const e of enrollData) {
    // Đăng ký học
    await prisma.enrollment.create({
      data: { id: `enrol-${e.userId}-${e.courseId}`, userId: e.userId, courseId: e.courseId },
    });

    // Tiến độ tổng quan khóa học
    await prisma.courseProgress.create({
      data: {
        id: `prog-${e.userId}-${e.courseId}`,
        userId: e.userId,
        courseId: e.courseId,
        progressPercent: e.progress,
        lastLessonId: e.lastLessonId, 
      },
    });

    // Đổ dữ liệu lịch sử từng bài học vào LessonProgress (Đúng schema)
    await prisma.lessonProgress.createMany({
      data: e.completedLessons.map(lessonId => ({
        id: `lprog-${e.userId}-${lessonId}`,
        userId: e.userId,
        lessonId: lessonId,
        watchedSeconds: 120, // Trường mới
        isCompleted: true
      }))
    });

    // Kết quả thi Quiz gốc của anh/chị 
    if (e.correctAnswers !== null) {
      const totalQuestions = 10; 
      const score = Math.round((e.correctAnswers / totalQuestions) * 100);
      const passed = score >= 50;

      const quizResult = await prisma.quizResult.create({
        data: {
          id: `qres-${e.userId}-${e.courseId}`,
          userId: e.userId,
          courseId: e.courseId,
          score: score,
          totalQuestions: totalQuestions,
          correctAnswers: e.correctAnswers,
          passed: passed,
        },
      });

      const courseTarget = coursesData.find(c => c.id === e.courseId);
      if (courseTarget) {
        const details = courseTarget.questions.map((q, index) => {
          const isCorrect = index < e.correctAnswers;
          const ansCorrect = q.answers.find(a => a.isCorrect)?.id || '';
          const ansIncorrect = q.answers.find(a => !a.isCorrect)?.id || '';

          return {
            quizResultId: quizResult.id,
            questionId: q.id,
            selectedAnswerId: isCorrect ? ansCorrect : ansIncorrect,
            isCorrect,
          };
        });
        await prisma.quizResultDetail.createMany({ data: details });
      }
    }
  }

  // ================= 5. KHỚP MỚI: ĐỔ DỮ LIỆU ĐÚNG SCHEMA CHO PAYMENT
  await prisma.payment.createMany({
    data: [
      { id: 'pay-1', userId: 'user-2', courseId: 'course-1', amount: 499000, status: 'completed', transactionNo: 'TXN-VNPAY-99122' },
      { id: 'pay-2', userId: 'user-2', courseId: 'course-2', amount: 799000, status: 'completed', transactionNo: 'TXN-STRIPE-88123' },
      { id: 'pay-3', userId: 'user-3', courseId: 'course-3', amount: 299000, status: 'completed', transactionNo: 'TXN-MOMO-77124' },
    ]
  });

  // ================= 6. KHỚP MỚI: ĐỔ DỮ LIỆU CHO COURSEREVIEW
  await prisma.courseReview.createMany({
    data: [
      { id: 'rev-1', userId: 'user-2', courseId: 'course-1', rating: 5, comment: 'Khóa học JS cực kỳ dễ hiểu, thầy giáo dạy rất có tâm!' },
      { id: 'rev-2', userId: 'user-3', courseId: 'course-1', rating: 4, comment: 'Bài tập thực hành hơi khó xíu nhưng chất lượng nha mọi người.' },
      { id: 'rev-3', userId: 'user-3', courseId: 'course-3', rating: 5, comment: 'Giao diện Figma hướng dẫn siêu chi tiết, tư duy UI đỉnh cao!' }
    ]
  });

  console.log('🌱 Seeding completed! Đã giữ nguyên vẹn 10 câu hỏi/khóa học và nạp đầy đủ dữ liệu bảng mới khớp 100% với Schema của anh/chị.');
}

main()
  .catch((e) => console.error('❌ Seed error:', e))
  .finally(() => prisma.$disconnect());