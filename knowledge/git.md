- Khởi tạo 
    git init

- Clone (tải xuống)
    git clone url.git

- Config
    git config --global user.name "John Doe"
    git config --global user.email "john@example.com"

- Trạng thái
    git status

- Lịch sử
    git log

- So sánh
    git diff

- Thêm file vào staging area để chuẩn bị commit. Sử dụng khi bạn muốn ghi lại thay đổi của một file cụ thể.
    git add
    git add file.txt
    git add . // Thêm tất cả các thay đổi vào staging area.

- Xóa file khỏi kho lưu trữ và staging area. Sử dụng khi bạn muốn xóa một file khỏi dự án.
    git rm <file>
    git rm file.txt

- Đổi tên file và theo dõi thay đổi. Sử dụng khi bạn muốn đổi tên file hoặc di chuyển file.
    git mv <old-name> <new-name>
    git mv old_name.txt new_name.txt

- Commit và ghi lại thay đổi
    git commit -m "Thêm tính năng mới"
    git commit --amend -m "Sửa thông điệp commit" // Sửa đổi commit cuối cùng. Sử dụng khi bạn cần thay đổi thông điệp commit hoặc thêm file vào commit cuối.

- Liệt kê tất cả các nhánh hiện có.
    git branch

- Tạo một nhánh mới.
    git branch <branch-name>
    git checkout feature-branch

- Tạo và chuyển ngay lập tức sang nhánh mới.
    git checkout -b new-feature

- Gộp nhánh vào nhánh hiện tại.
    git merge <branch-name>
    git merge feature-branch

- Rebase nhánh hiện tại lên nhánh đích. Sử dụng khi bạn muốn di chuyển các commit của mình lên đầu lịch sử commit của nhánh khác.
    git rebase main

- Tải về các thay đổi từ kho lưu trữ từ xa mà không hợp nhất vào nhánh hiện tại. Sử dụng khi bạn muốn cập nhật thông tin về các thay đổi từ xa mà không áp dụng ngay.
    git fetch

- Tải về và hợp nhất các thay đổi từ nhánh từ xa vào nhánh hiện tại. Sử dụng để đồng bộ hóa kho lưu trữ cục bộ với kho lưu trữ từ xa.
    git pull
    git pull origin main

- Đẩy các commit từ kho lưu trữ cục bộ lên kho lưu trữ từ xa. Sử dụng để chia sẻ các thay đổi của bạn với các thành viên khác.
    git push origin main
    git push -u origin feature-branch // thiết lập nhánh theo dõi

-  Hoàn tác các thay đổi về một commit cụ thể, giữ lại hoặc xóa các thay đổi trong thư mục làm việc. Sử dụng khi bạn muốn quay lại một trạng thái trước đó của dự án.
    git reset <commit>
    git reset --soft HEAD~1  # Giữ lại thay đổi trong thư mục làm việc
    git reset --hard HEAD~1  # Xóa thay đổi trong thư mục làm việc

- Tạo một commit mới để đảo ngược các thay đổi của một commit cụ thể. Sử dụng khi bạn muốn hoàn tác các thay đổi mà không làm mất lịch sử commit.
    git revert <commit-hash>

- Lưu trữ tạm thời các thay đổi chưa commit. Sử dụng khi bạn cần chuyển nhánh nhưng không muốn commit các thay đổi chưa hoàn thành.
    git stash

- Áp dụng các thay đổi đã lưu trữ tạm thời.
    git stash apply

- Áp dụng các thay đổi đã lưu trữ và xóa nó khỏi danh sách stash.
    git stash pop

- Hiển thị ai đã thay đổi dòng nào trong file. Sử dụng để xác định ai là người thực hiện thay đổi trong mã.
    git blame file.txt

- Sử dụng tìm kiếm nhị phân để tìm ra commit đã gây ra lỗi. Sử dụng khi bạn muốn xác định commit nào đã gây ra một vấn đề cụ thể.
    git bisect start

-  Khi hợp nhất nhánh và có xung đột, Git sẽ yêu cầu bạn giải quyết xung đột thủ công.
    git merge feature-branch

- Xóa nhánh đã hợp nhất
    git branch -d <branch-name>
