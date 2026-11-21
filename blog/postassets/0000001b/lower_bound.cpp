// 二分：两种边界查找（半开区间，答案落在 [l, r)）
// 与 0000001b 正文同源，g++ 16 -std=c++17 -O2 -Wall -Wextra 编译无警告。
#include <vector>

int lower_bound_pos(const std::vector<int> &a, int x) {   // 第一个 >= x 的位置
    int l = 0, r = (int)a.size();                         // 答案在 [l, r)
    while (l < r) {
        int mid = l + (r - l) / 2;
        if (a[mid] < x) l = mid + 1; else r = mid;
    }
    return l;
}

int upper_bound_pos(const std::vector<int> &a, int x) {   // 第一个 > x 的位置
    int l = 0, r = (int)a.size();
    while (l < r) {
        int mid = l + (r - l) / 2;
        if (a[mid] <= x) l = mid + 1; else r = mid;
    }
    return l;
}
