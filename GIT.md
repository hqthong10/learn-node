# Git — Hướng dẫn sử dụng

> Người mới: đọc từ đầu đến mục 6. Người đã biết: xem [Bảng tra nhanh](#12-bảng-tra-nhanh) và mục [Hoàn tác](#7-hoàn-tác).

## Mục lục

1. [Khái niệm cốt lõi](#1-khái-niệm-cốt-lõi)
2. [Cài đặt & cấu hình](#2-cài-đặt--cấu-hình)
3. [Tạo / lấy repo](#3-tạo--lấy-repo)
4. [Quy trình hằng ngày](#4-quy-trình-hằng-ngày)
5. [Nhánh (branch)](#5-nhánh-branch)
6. [Làm việc với remote](#6-làm-việc-với-remote)
7. [Hoàn tác](#7-hoàn-tác)
8. [Merge, rebase & xung đột](#8-merge-rebase--xung-đột)
9. [Stash — cất tạm thay đổi](#9-stash--cất-tạm-thay-đổi)
10. [Xem lịch sử & tìm lỗi](#10-xem-lịch-sử--tìm-lỗi)
11. [Nâng cao](#11-nâng-cao)
12. [Bảng tra nhanh](#12-bảng-tra-nhanh)

---

## 1. Khái niệm cốt lõi

Git lưu thay đổi qua **3 vùng** cục bộ, cộng thêm **remote** (server như GitHub):

```
Working Directory  --git add-->  Staging Area  --git commit-->  Local Repo  --git push-->  Remote
 (file đang sửa)                 (chuẩn bị commit)               (lịch sử)                  (GitHub...)
                                                                 <--git pull / fetch--
```

| Thuật ngữ | Ý nghĩa |
|---|---|
| **commit** | Một "ảnh chụp" trạng thái code, có mã hash (vd `a54a37c`) |
| **branch** | Con trỏ trỏ tới một commit; dùng để phát triển song song |
| **HEAD** | Vị trí hiện tại của bạn (thường là nhánh đang đứng) |
| **origin** | Tên mặc định của remote |
| `HEAD~1` | Commit ngay trước HEAD (`HEAD~2` là 2 commit trước) |

---

## 2. Cài đặt & cấu hình

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main   # nhánh mặc định khi init
git config --global pull.rebase false         # pull = merge (hoặc true nếu muốn rebase)
git config --global core.editor "code --wait" # dùng VS Code làm editor

git config --list                             # xem cấu hình hiện tại
```

Alias tiện dụng:

```bash
git config --global alias.st status
git config --global alias.lg "log --oneline --graph --all"
```

---

## 3. Tạo / lấy repo

```bash
git init                         # biến thư mục hiện tại thành repo
git clone <url>                  # tải repo có sẵn về
git clone <url> my-folder        # clone vào thư mục tên khác
```

File `.gitignore` liệt kê những gì Git bỏ qua:

```
node_modules/
.env
*.log
dist/
```

---

## 4. Quy trình hằng ngày

```bash
git status                       # xem file nào thay đổi / đã stage
git diff                         # xem thay đổi CHƯA stage
git diff --staged                # xem thay đổi ĐÃ stage

git add file.txt                 # stage một file
git add .                        # stage tất cả
git add -p                       # stage từng đoạn (chọn lọc)

git commit -m "feat: thêm API login"
git commit -am "fix: sửa lỗi"    # add + commit các file đã được track

git push                         # đẩy lên remote
```

Xóa / đổi tên file (Git tự ghi nhận):

```bash
git rm file.txt                  # xóa file khỏi repo và ổ đĩa
git rm --cached file.txt         # bỏ track nhưng giữ file trên ổ đĩa
git mv old.txt new.txt           # đổi tên / di chuyển
```

**Viết commit message tốt** (quy ước Conventional Commits):

```
<type>: <mô tả ngắn, thể mệnh lệnh>

feat:     tính năng mới
fix:      sửa lỗi
refactor: sửa code không đổi hành vi
docs:     tài liệu
chore:    việc lặt vặt (build, deps...)
```

---

## 5. Nhánh (branch)

```bash
git branch                       # liệt kê nhánh local
git branch -a                    # cả nhánh remote

git switch feature-x             # chuyển nhánh
git switch -c feature-x          # tạo mới + chuyển sang
# Cú pháp cũ tương đương: git checkout feature-x / git checkout -b feature-x

git branch -m new-name           # đổi tên nhánh hiện tại
git branch -d feature-x          # xóa nhánh (đã merge)
git branch -D feature-x          # xóa ép buộc (chưa merge)
git push origin --delete feature-x  # xóa nhánh trên remote
```

**Luồng làm việc điển hình:**

```bash
git switch main && git pull      # cập nhật main
git switch -c feature/login      # tạo nhánh tính năng
# ... code, add, commit ...
git push -u origin feature/login # đẩy lên lần đầu, -u để liên kết nhánh
# -> mở Pull Request trên GitHub -> review -> merge
```

---

## 6. Làm việc với remote

```bash
git remote -v                    # xem danh sách remote
git remote add origin <url>      # thêm remote

git fetch                        # tải thay đổi về, KHÔNG gộp vào code
git pull                         # = fetch + merge
git pull --rebase                # = fetch + rebase (lịch sử thẳng hơn)

git push                         # đẩy nhánh hiện tại
git push -u origin <branch>      # lần đầu: đẩy và thiết lập tracking
git push --force-with-lease      # ép đẩy an toàn (sau khi rebase/amend)
```

> ⚠️ Không dùng `git push --force` trên nhánh chung (`main`, `develop`). Nếu buộc phải ép, dùng `--force-with-lease` — nó từ chối nếu người khác đã đẩy commit mới.

---

## 7. Hoàn tác

Tra theo **tình huống**:

| Tình huống | Lệnh |
|---|---|
| Bỏ thay đổi của file chưa stage | `git restore file.txt` |
| Bỏ stage (giữ thay đổi) | `git restore --staged file.txt` |
| Sửa message / thêm file vào commit cuối | `git commit --amend` |
| Hủy commit cuối, **giữ thay đổi đã stage** | `git reset --soft HEAD~1` |
| Hủy commit cuối, giữ thay đổi chưa stage | `git reset HEAD~1` |
| Hủy commit cuối, **xóa sạch thay đổi** ⚠️ | `git reset --hard HEAD~1` |
| Đảo ngược commit đã push (an toàn) | `git revert <hash>` |
| Xóa file chưa track | `git clean -n` (xem trước), `git clean -fd` (xóa) |
| Lỡ tay `reset --hard`, muốn cứu | `git reflog` → `git reset --hard <hash>` |

**Nguyên tắc:**
- Commit **chưa push** → thoải mái `reset`, `amend`.
- Commit **đã push** lên nhánh chung → dùng `revert`, không viết lại lịch sử.

---

## 8. Merge, rebase & xung đột

```bash
# Đang ở nhánh feature, muốn lấy code mới từ main:
git merge main                   # tạo merge commit, giữ nguyên lịch sử
git rebase main                  # đặt commit của bạn lên đầu main, lịch sử thẳng
```

| | Merge | Rebase |
|---|---|---|
| Lịch sử | Giữ nguyên, có merge commit | Thẳng, gọn |
| Viết lại commit | Không | Có (hash thay đổi) |
| Dùng khi | Nhánh chung, đã push | Nhánh cá nhân, chưa chia sẻ |

**Xử lý xung đột (conflict):**

1. Git báo conflict → mở file, tìm đoạn:
   ```
   <<<<<<< HEAD
   code của bạn
   =======
   code từ nhánh kia
   >>>>>>> main
   ```
2. Sửa lại cho đúng, xóa các dấu `<<<<<<<`, `=======`, `>>>>>>>`.
3. Đánh dấu đã xong:
   ```bash
   git add file.txt
   git commit                    # nếu đang merge
   git rebase --continue         # nếu đang rebase
   ```
4. Muốn bỏ cuộc: `git merge --abort` hoặc `git rebase --abort`.

---

## 9. Stash — cất tạm thay đổi

Dùng khi cần chuyển nhánh gấp mà code đang dở.

```bash
git stash                        # cất thay đổi
git stash -u                     # cất cả file chưa track
git stash push -m "đang làm login"  # cất kèm ghi chú

git stash list                   # xem danh sách
git stash pop                    # lấy lại + xóa khỏi stash
git stash apply                  # lấy lại, vẫn giữ trong stash
git stash drop stash@{0}         # xóa một stash
```

---

## 10. Xem lịch sử & tìm lỗi

```bash
git log --oneline                # mỗi commit một dòng
git log --oneline --graph --all  # dạng cây, mọi nhánh
git log -p file.txt              # lịch sử thay đổi của một file
git log --author="Thong"         # lọc theo tác giả
git log -S "functionName"        # tìm commit thêm/xóa chuỗi

git show <hash>                  # chi tiết một commit
git diff main..feature           # so sánh hai nhánh
git blame file.txt               # ai sửa dòng nào, khi nào
```

**Tìm commit gây lỗi bằng `bisect`** (tìm kiếm nhị phân):

```bash
git bisect start
git bisect bad                   # commit hiện tại bị lỗi
git bisect good <hash>           # commit cũ chạy tốt
# Git checkout các commit ở giữa -> bạn test rồi gõ good / bad
git bisect reset                 # xong, quay về
```

---

## 11. Nâng cao

**Rebase tương tác** — gộp, sửa, sắp xếp lại commit trước khi push:

```bash
git rebase -i HEAD~3
# Trong editor: pick (giữ), squash/s (gộp vào trên), reword/r (sửa message), drop/d (bỏ)
```

**Cherry-pick** — lấy một commit từ nhánh khác:

```bash
git cherry-pick <hash>
```

**Reflog** — nhật ký mọi chuyển động của HEAD, cứu được hầu hết "tai nạn":

```bash
git reflog
git reset --hard HEAD@{2}
```

**Tag** — đánh dấu phiên bản:

```bash
git tag v1.0.0
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0           # hoặc --tags để đẩy tất cả
```

**Worktree** — mở nhiều nhánh cùng lúc ở các thư mục khác nhau:

```bash
git worktree add ../hotfix hotfix-branch
git worktree remove ../hotfix
```

---

## 12. Bảng tra nhanh

| Việc cần làm | Lệnh |
|---|---|
| Xem trạng thái | `git status` |
| Stage tất cả | `git add .` |
| Commit | `git commit -m "msg"` |
| Sửa commit cuối | `git commit --amend` |
| Tạo + chuyển nhánh | `git switch -c <name>` |
| Chuyển nhánh | `git switch <name>` |
| Cập nhật từ remote | `git pull` |
| Đẩy lên lần đầu | `git push -u origin <name>` |
| Gộp nhánh | `git merge <name>` |
| Cất tạm | `git stash` / `git stash pop` |
| Bỏ thay đổi file | `git restore <file>` |
| Bỏ stage | `git restore --staged <file>` |
| Hủy commit cuối (giữ code) | `git reset --soft HEAD~1` |
| Đảo ngược commit đã push | `git revert <hash>` |
| Lịch sử gọn | `git log --oneline --graph` |
| Cứu commit bị mất | `git reflog` |
| Xóa nhánh | `git branch -d <name>` |
