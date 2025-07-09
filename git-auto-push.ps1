param(
    [string]$Mess = "Auto commit: cập nhật code mới nhất!"
)

# Thêm tất cả các file thay đổi
git add .

# Commit với message
git commit -m $Mess

# Push lên nhánh hiện tại 
git push