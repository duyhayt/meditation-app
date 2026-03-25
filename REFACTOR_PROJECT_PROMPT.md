Bạn là Senior React Native Engineer. Hãy xây dựng ứng dụng mới từ codebase hiện tại với tên tạm Meditation App (Ứng dụng thiền).

0) Bối cảnh và nguyên tắc
Dùng kiến trúc hiện tại của project (Expo + React Native + TypeScript strict + React Navigation + Zustand + React Query + i18n + theme + DI).
Loại bỏ các feature/demo module không cần thiết hiện tại.
Không làm login ở phase hiện tại.
Không làm social/community ở phase hiện tại.
Không làm cloud sync ở phase hiện tại.
Mục tiêu hiện tại: offline-first + local database + audio playback ổn định + production-ready structure.
Ứng dụng ưu tiên trải nghiệm thiền đơn giản, mượt, nhẹ, dễ dùng, dễ mở rộng.
Yêu cầu code sạch, dễ bảo trì, dễ mở rộng, reusable component cao.
UI cần tạo cảm giác thư giãn, tối giản, hiện đại, cao cấp.
Không phụ thuộc runtime vào nguồn audio bên thứ ba; kiến trúc phải hỗ trợ local cache/CDN.
1) Yêu cầu bắt buộc
Đồng bộ style/UI: cùng design tokens, spacing, typography, color semantics, component variants.
Dark/Light mode đầy đủ.
Đa ngôn ngữ tối thiểu: vi và en.
Local database dùng expo-sqlite.
Viết migration versioned, có schema version.
Offline-first: local database là source of truth cho phase hiện tại.
Audio architecture phải hỗ trợ 3 loại source:
bundled
stream
downloaded
Có cơ chế resolve audio source theo thứ tự:
local file nếu tồn tại
stream URL nếu chưa có local
báo lỗi nếu không có source hợp lệ
Tạo abstraction rõ ràng cho:
audio player service
download manager
local file storage
reminder/notification
Tạo tài liệu kiến trúc và flow sau khi làm xong.
2) Domain mục tiêu

Ứng dụng hỗ trợ:

Guided meditation
Breathing exercises
Sleep sounds
Meditation courses
Daily streak
Meditation history
Progress tracking
Reminder thiền hằng ngày
Download audio để nghe offline
Continue last session
Favorites
Premium/Sync chỉ để placeholder phase sau
3) Database schema (bắt buộc tạo)

Tạo bảng:

categories
meditations
courses
course_lessons
breathing_exercises
sleep_sounds
session_history
daily_progress
downloads
favorites
reminders
app_settings
activity_logs
sync_metadata

Yêu cầu:

Định nghĩa khóa chính, khóa ngoại, index quan trọng.
Có các trường created_at, updated_at hợp lý.
Có version field cho content/audio nếu cần update về sau.
Có trạng thái download: queued | downloading | completed | failed.
Có trường audio type: bundled | stream | downloaded.
Không lưu binary audio trong SQLite, chỉ lưu metadata và local file URI.
Tạo repository layer riêng cho từng module chính.
4) Core features cần làm ở phase hiện tại
Onboarding.
Home dashboard.
Meditation category list.
Meditation list theo category.
Meditation detail.
Audio player.
Breathing exercises.
Sleep sounds.
Meditation course list + lesson flow.
Download audio để nghe offline.
Favorites.
Progress tracking.
Daily streak.
Session history.
Reminder center (local schedule logic + data model; nếu chưa push notification thì tạo abstraction sẵn).
Settings: ngôn ngữ, theme, tùy chọn app local.
Bottom tabs: Home, Meditate, Sleep, Profile.
Quick action trên Home: Start 5-minute meditation / Continue last session.
5) Screen list mục tiêu

Ưu tiên làm trước:

S01 Splash
S02 Onboarding
S03 Home
S04 Category List
S05 Meditation List
S06 Meditation Detail
S07 Audio Player
S08 Breathing List
S09 Breathing Session
S10 Sleep Sounds
S11 Course List
S12 Course Detail
S13 Course Lesson Player
S14 Favorites
S15 Progress
S16 History
S17 Reminder Center
S18 Settings

Tạo placeholder route cho phase sau:

S19 Premium
S20 Login
S21 Sync
S22 Account
6) Flow bắt buộc
App Start: Splash -> Onboarding -> Home
nếu đã onboarding thì Splash -> Home.
Meditation Flow: Home -> Category List -> Meditation List -> Meditation Detail -> Audio Player.
Quick Start Flow: Home -> Start 5-minute meditation -> Audio Player.
Continue Flow: Home -> Continue last session -> Audio Player.
Breathing Flow: Home hoặc Breathing List -> Breathing Session.
Sleep Flow: Home hoặc Sleep tab -> Sleep Sounds -> Player.
Course Flow: Home -> Course List -> Course Detail -> Lesson Player.
Download Flow: Meditation Detail hoặc Course Lesson -> Download -> Local playback available offline.
Reminder Flow: Profile/Settings hoặc Meditation Detail -> Set Reminder -> Reminder Center.
Progress Flow: Profile -> Progress -> History.
7) Cách triển khai theo phase (bắt buộc)

Thực hiện theo từng phase, sau mỗi phase phải chạy lint / typecheck / test và báo cáo.

Phase 1: Foundation
Dọn module cũ không liên quan.
Chuẩn hóa folder theo feature.
Thiết kế design tokens + reusable UI kit.
Setup i18n vi/en đầy đủ key.
Setup dark/light.
Setup app shell + navigation structure.
Tạo placeholder screens đúng flow.
Phase 2: Database + Repositories
Setup SQLite service.
Tạo migrations schema đầy đủ.
Tạo repository layer.
Seed/test data cho dev.
Tạo model cho offline-first content metadata.
Phase 3: Core Meditation Content
Làm categories.
Làm meditation list/detail.
Làm favorites.
Làm course list/detail/lesson data flow.
Tạo data resolver cho content source.
Phase 4: Audio + Downloads
Tạo AudioService độc lập với UI.
Tạo DownloadService.
Resolve source theo local -> stream -> error.
Lưu last played session.
Playback progress, play/pause/resume/seek.
Update DB khi download xong.
Delete downloaded file + sync lại DB.
Phase 5: Breathing + Sleep + Reminder
Breathing exercise flow.
Sleep sounds flow.
Reminder center + data flow.
Chuẩn bị abstraction cho local notification.
Phase 6: Progress + Settings
Daily streak.
Session history.
Daily progress statistics.
Settings cho ngôn ngữ/theme/tùy chọn local.
Empty/loading/error states đồng nhất.
Phase 7: Hardening
Kiểm thử luồng chính.
Tối ưu performance cho list và player state updates.
Kiểm tra offline mode.
Kiểm tra app relaunch / restore current session.
Viết docs kiến trúc + flow + schema.
8) Tiêu chuẩn kỹ thuật
TypeScript strict, không any.
Form validation dùng zod.
Component tái sử dụng cao, tránh hardcode style.
Tách rõ: screen, hook, repository, service, type.
Không để business logic nặng trong UI.
Có test tối thiểu cho service/repository quan trọng.
Có CI chạy lint/typecheck/test.
Không lưu blob audio trong SQLite.
Không hardcode stream URL rải rác trong UI.
Tất cả playback logic phải đi qua AudioService.
Tất cả download/delete file phải đi qua DownloadService.
Có hàm hoặc module riêng để resolve audio source.
Không để toàn bộ app re-render khi progress player thay đổi.
9) Audio architecture bắt buộc

Thiết kế audio theo chuẩn sau:

9.1 Audio source priority
Nếu local_file_uri tồn tại và file còn tồn tại thật -> phát local
Nếu chưa có local nhưng có stream_url -> phát stream
Nếu không có source hợp lệ -> show handled error state
9.2 Download state
queued
downloading
completed
failed
9.3 Session completion rules
Guided meditation: completed nếu nghe >= 80%
Timer/breathing: completed nếu hoàn tất đủ duration/cycles
Sleep sounds: không nhất thiết tính completed như guided meditation
Một ngày được tính streak nếu tổng thời gian thiền >= 5 phút
9.4 Storage rules
Metadata -> SQLite
Small settings -> AsyncStorage/MMKV
Audio files -> local file system
Remote metadata/audio -> CDN/backend placeholder
10) UI/UX yêu cầu
Phong cách hiện đại, tối giản, thư giãn.
Nhiều khoảng trắng, bo góc mềm, gradient nhẹ, dark mode thân thiện.
Full-screen player đẹp, ít nút, tập trung trải nghiệm.
Danh sách category, meditation, course phải rõ ràng và premium-looking.
Animation nhẹ, không lạm dụng.
Empty/loading/error states phải đẹp, thống nhất.
App cần tạo cảm giác giống các ứng dụng như Calm / Headspace / Medito, nhưng đơn giản hơn và thực tế hơn.
11) Output format bạn phải trả về

Mỗi lần phản hồi:

Những gì đã làm.
File đã tạo/sửa.
Lý do thiết kế chính.
Cách kiểm thử.
Checklist phase hiện tại đã xong/chưa.

Bắt đầu ngay với Phase 1, sau đó dừng và báo cáo để tôi duyệt trước khi sang phase tiếp theo.