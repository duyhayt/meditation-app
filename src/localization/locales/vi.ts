const vi = {
  common: {
    continue: 'Tiếp tục',
    open: 'Mở',
    back: 'Quay lại',
    startNow: 'Bắt đầu',
    viewAll: 'Xem tất cả',
    playNow: 'Phát ngay',
    setReminder: 'Đặt nhắc nhở',
    continueListening: 'Tiếp tục nghe',
    retry: 'Thử lại',
    language: 'Ngôn ngữ',
    theme: 'Giao diện',
    themeSystem: 'Theo hệ thống',
    themeLight: 'Sáng',
    themeDark: 'Tối',
    reduceMotion: 'Giảm chuyển động',
    placeholderTitle: 'Để dành cho phase sau',
    placeholderDescription: 'Cấu trúc route đã sẵn sàng và sẽ được nối logic ở phase tiếp theo.'
  },
  splash: {
    title: 'Meditation App',
    subtitle: 'Ứng dụng đồng hành nhẹ nhàng cho thiền, giấc ngủ và thói quen chánh niệm theo hướng offline-first.'
  },
  onboarding: {
    eyebrow: 'Chào mừng',
    title: 'Một nhịp nghỉ nhẹ hơn cho ngày bận rộn và buổi tối yên tĩnh',
    subtitle:
      'Bắt đầu với guided meditation đơn giản, breathing reset, sleep sounds và nền tảng được thiết kế cho playback offline ổn định.',
    primaryCta: 'Vào ứng dụng',
    bullets: {
      one: 'Kiến trúc offline-first với local database là trung tâm',
      two: 'Kiến trúc audio rõ ràng cho bundled, stream và downloaded',
      three: 'Giao diện tối giản, thư giãn, đầy đủ dark mode và light mode'
    }
  },
  navigation: {
    homeTab: 'Home',
    meditateTab: 'Thiền',
    sleepTab: 'Ngủ',
    profileTab: 'Hồ sơ'
  },
  home: {
    title: 'Chào buổi tối',
    subtitle: 'Chọn một điểm bắt đầu thật nhẹ.',
    quickStart: 'Bắt đầu bài thiền 5 phút',
    continueSession: 'Tiếp tục phiên gần nhất',
    featuredTitle: 'Tối nay, hãy chọn sự dịu lại',
    featuredSubtitle: 'Một nhịp ritual cao cấp hơn để chậm xuống, thở sâu hơn và nghỉ ngơi trọn vẹn hơn.',
    categories: 'Lối vào thư viện thiền',
    continueTitle: 'Tiếp tục phiên gần nhất',
    continueSubtitle: 'Quay lại đúng nơi bạn đang dở mà không làm đứt mạch thư giãn.',
    breathing: 'Bài tập thở',
    courses: 'Khoá học',
    sleep: 'Âm thanh ngủ',
    discover: 'Khám phá nội dung dịu hơn'
  },
  meditate: {
    categoryTitle: 'Thư viện thiền',
    categorySubtitle: 'Khám phá guided sessions, breathing reset và course theo lộ trình.',
    listTitle: 'Danh sách bài thiền',
    listSubtitle: 'Chọn một phiên phù hợp với trạng thái hiện tại của bạn.',
    detailTitle: 'Chi tiết bài thiền',
    detailSubtitle: 'Xem nhanh cấu trúc, lưu lại hoặc bắt đầu phát.',
    playerTitle: 'Trình phát',
    playerSubtitle: 'Phase 1 dựng sẵn trải nghiệm player toàn màn hình và luồng điều hướng.'
  },
  breathing: {
    title: 'Bài tập thở',
    subtitle: 'Những pattern đơn giản cho tập trung, bình tĩnh và reset.',
    sessionTitle: 'Phiên thở',
    sessionSubtitle: 'Màn hình timer hướng dẫn sẽ được nối logic ở phase tiếp theo.'
  },
  sleep: {
    title: 'Âm thanh ngủ',
    subtitle: 'Không gian âm thanh dịu nhẹ cho trước giờ ngủ hoặc lúc cần tập trung sâu.'
  },
  courses: {
    title: 'Khoá học thiền',
    subtitle: 'Các hành trình nhiều bài học để xây dựng thói quen.',
    detailTitle: 'Chi tiết khoá học',
    detailSubtitle: 'Xem danh sách lesson, nhịp độ và mục tiêu của course.',
    lessonTitle: 'Player bài học',
    lessonSubtitle: 'Playback lesson sẽ dùng chung AudioService ở phase tiếp theo.'
  },
  favorites: {
    title: 'Yêu thích',
    subtitle: 'Những bài thiền, âm thanh và lesson bạn đã lưu.'
  },
  progress: {
    title: 'Tiến trình',
    subtitle: 'Streak hằng ngày, tổng số phút thiền và xu hướng hoàn thành.'
  },
  history: {
    title: 'Lịch sử',
    subtitle: 'Dòng thời gian local của các phiên nghe và thiền.'
  },
  reminders: {
    title: 'Trung tâm nhắc nhở',
    subtitle: 'Lưu lịch thiền hằng ngày trên máy và chuẩn bị cho tích hợp notification.'
  },
  settings: {
    title: 'Cài đặt',
    subtitle: 'Tùy chỉnh ngôn ngữ, giao diện và các preference cục bộ của ứng dụng.',
    appearance: 'Giao diện',
    preferences: 'Tùy chọn',
    accountSection: 'Các phase sau',
    premium: 'Premium',
    login: 'Đăng nhập',
    sync: 'Đồng bộ',
    account: 'Tài khoản'
  },
  placeholders: {
    premiumTitle: 'Placeholder Premium',
    loginTitle: 'Placeholder đăng nhập',
    syncTitle: 'Placeholder đồng bộ',
    accountTitle: 'Placeholder tài khoản'
  }
} as const;

export default vi;
