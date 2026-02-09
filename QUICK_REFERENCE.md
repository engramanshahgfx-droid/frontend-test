# Chinese Localization - Quick Reference Card

## 🔤 Translation Keys - Complete Reference

### Navigation (nav.*)
```
nav.home              → Home / الرئيسية / 首页
nav.about             → About Us / من نحن / 关于我们
nav.contact           → Contact Us / اتصل بنا / 联系我们
nav.products          → Products / المنتجات / 产品
nav.services          → Services / الخدمات / 服务
nav.blog              → Blog / المدونة / 博客
nav.dashboard         → Dashboard / لوحة التحكم / 仪表板
nav.admin             → Admin Panel / لوحة المسؤول / 管理员面板
nav.aboutSaudi        → About Saudi Arabia / عن السعودية / 关于沙特阿拉伯
nav.visa              → Visa / التأشيرة / 签证
nav.bookings          → My Bookings / حجوزاتي / 我的预订
nav.offers            → Special Offers / العروض الخاصة / 特别优惠
nav.payment           → Payment / الدفع / 支付
nav.trips             → Trips / الرحلات / 旅行
nav.faq               → FAQ / الأسئلة الشائعة / 常见问题
nav.terms             → Terms & Conditions / الشروط والأحكام / 条款和条件
```

### Buttons (buttons.*)
```
buttons.submit        → Submit / إرسال / 提交
buttons.cancel        → Cancel / إلغاء / 取消
buttons.readMore      → Read More / اقرأ المزيد / 阅读更多
buttons.learnMore     → Learn More / تعرف على المزيد / 了解更多
buttons.bookNow       → Book Now / احجز الآن / 立即预订
buttons.viewDetails   → View Details / عرض التفاصيل / 查看详情
buttons.edit          → Edit / تعديل / 编辑
buttons.delete        → Delete / حذف / 删除
buttons.save          → Save / حفظ / 保存
buttons.back          → Back / رجوع / 返回
buttons.next          → Next / التالي / 下一步
buttons.confirm       → Confirm / تأكيد / 确认
buttons.logout        → Logout / تسجيل الخروج / 登出
buttons.login         → Login / تسجيل الدخول / 登录
buttons.register      → Register / تسجيل / 注册
buttons.download      → Download / تحميل / 下载
buttons.upload        → Upload / رفع / 上传
buttons.close         → Close / إغلاق / 关闭
buttons.reset         → Reset / إعادة تعيين / 重置
buttons.search        → Search / بحث / 搜索
buttons.send          → Send / إرسال / 发送
```

### Forms (forms.*)
```
forms.firstName       → First Name / الاسم الأول / 名字
forms.lastName        → Last Name / الاسم الأخير / 姓氏
forms.fullName        → Full Name / الاسم الكامل / 全名
forms.email           → Email Address / عنوان البريد الإلكتروني / 电子邮件地址
forms.phoneNumber     → Phone Number / رقم الهاتف / 电话号码
forms.address         → Address / العنوان / 地址
forms.city            → City / المدينة / 城市
forms.country         → Country / الدولة / 国家/地区
forms.state           → State/Province / الولاية/المحافظة / 州/省
forms.zipCode         → Zip/Postal Code / الرمز البريدي / 邮政编码
forms.password        → Password / كلمة المرور / 密码
forms.confirmPassword → Confirm Password / تأكيد كلمة المرور / 确认密码
forms.username        → Username / اسم المستخدم / 用户名
forms.subject         → Subject / الموضوع / 主题
forms.message         → Message / الرسالة / 消息
forms.checkInDate     → Check-in Date / تاريخ الوصول / 入住日期
forms.checkOutDate    → Check-out Date / تاريخ المغادرة / 退房日期
forms.adults          → Number of Adults / عدد البالغين / 成人数量
forms.children        → Number of Children / عدد الأطفال / 儿童数量
```

### Validation (validation.*)
```
validation.required   → This field is required / هذا الحقل مطلوب / 此字段为必填项
validation.invalidEmail → Please enter valid email / إدخال بريد صحيح / 请输入有效的电子邮件
validation.minLength  → Must be at least {count} characters / يجب {count} على الأقل / 长度至少为{count}
```

### Success Messages (success.*)
```
success.submitted     → Successfully submitted / تم الإرسال بنجاح / 提交成功
success.saved         → Changes saved successfully / تم الحفظ بنجاح / 保存成功
success.bookingConfirmed → Your booking has been confirmed / تم تأكيد الحجز / 您的预订已确认
success.paymentSuccess → Payment successful / تم الدفع بنجاح / 支付成功
success.loginSuccess   → Login successful / تسجيل الدخول بنجاح / 登录成功
```

### Error Messages (errors.*)
```
errors.serverError    → Server error. Please try again later / خطأ في الخادم / 服务器错误
errors.unauthorized   → You are not authorized / غير مصرح / 您未被授权
errors.paymentFailed  → Payment failed. Please try again / فشل الدفع / 支付失败
errors.invalidCredentials → Invalid email or password / بيانات غير صحيحة / 电子邮件或密码无效
```

### General Messages (general.*)
```
general.welcome       → Welcome / أهلا وسهلا / 欢迎
general.loading       → Loading... / جاري التحميل / 加载中...
general.noData        → No data available / لا توجد بيانات / 暂无数据
general.noResults     → No results found / لم يتم العثور على نتائج / 未找到结果
general.language      → Language / اللغة / 语言
general.english       → English / English / English
general.arabic        → العربية / العربية / العربية
general.chinese       → 中文 / 中文 / 中文
general.currency      → Currency / العملة / 货币
general.sar           → SAR / ريال سعودي / 沙特里亚尔
general.usd           → USD / دولار أمريكي / 美元
general.cny           → CNY / يوان صيني / 人民币
```

---

## 💻 Code Examples

### Use in Components
```jsx
// Client component
"use client";
import { useTranslation } from "@/hooks/useTranslation";

export default function Component() {
  const { t, isRTL } = useTranslation();
  
  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <label>{t('forms.email')}</label>
      <button>{t('buttons.submit')}</button>
    </div>
  );
}
```

### Format Dates
```jsx
import { formatDate } from "@/lib/localization";

{formatDate(new Date(), "zh")}  // 2024年2月1日
{formatDate(new Date(), "en")}  // February 1, 2024
{formatDate(new Date(), "ar")}  // 1 فبراير 2024
```

### Format Currency
```jsx
import { formatCurrency } from "@/lib/localization";

{formatCurrency(1000, "SAR", "zh")}  // 1,000.00 ر.ع. (Chinese format)
{formatCurrency(1000, "CNY", "zh")}  // ¥1,000.00
{formatCurrency(1000, "USD", "en")}  // $1,000.00
```

### Format Numbers
```jsx
import { formatNumber } from "@/lib/localization";

{formatNumber(1234567, "zh")}  // 1,234,567 (Chinese format)
{formatNumber(1234567, "ar")}  // ١٬٢٣٤٬٥٦٧ (Arabic-Indic)
```

### Check Language Direction
```jsx
import { getTextDirection } from "@/lib/localization";

const direction = getTextDirection(language);
// direction === "rtl" for Arabic
// direction === "ltr" for English and Chinese
```

### Language Switcher
```jsx
import LanguageSwitcher from "@/components/LanguageSwitcher";

<LanguageSwitcher lang={lang} />
```

---

## 🎨 CSS Patterns

### RTL-Safe CSS
```css
/* Good - works in both LTR and RTL */
.container {
  margin-inline-start: 1rem;    /* left in LTR, right in RTL */
  margin-inline-end: 1rem;      /* right in LTR, left in RTL */
  padding-inline-start: 1rem;
  text-align: start;            /* left in LTR, right in RTL */
}

/* Avoid */
.container {
  margin-left: 1rem;  /* breaks in RTL */
  text-align: left;   /* breaks in RTL */
}
```

### RTL-Specific Styling
```css
[dir="rtl"] .element {
  flex-direction: row-reverse;
}

[dir="rtl"] .dropdown {
  left: 0;
  right: auto;
}
```

### Language-Specific Styling
```css
/* Chinese-specific */
[lang="zh"] .text {
  line-height: 1.6;
  letter-spacing: 0.5px;
}

/* Arabic-specific */
[dir="rtl"] .text {
  font-family: 'Tajawal', sans-serif;
}
```

---

## 🔧 Common Tasks

### Add New Translation String
1. Add to all three JSON files:
```json
{
  "newSection": {
    "newKey": "English text"
  }
}
```

2. Use: `{t('newSection.newKey')}`

### Format Date for Language
```jsx
formatDate(date, language)  // Pass "en", "ar", or "zh"
```

### Get Current Language in Component
```jsx
const { language } = useTranslation();
// Returns: "en", "ar", or "zh"
```

### Check if RTL Language
```jsx
const { isRTL } = useTranslation();
// Returns: true for Arabic, false for others
```

### Interpolation with Values
```json
{
  "greeting": "Hello {name}",
  "minLength": "Must be {count} characters"
}
```

```jsx
{t('greeting', { name: 'Ahmed' })}
{t('minLength', { count: 8 })}
```

---

## 📱 Responsive Breakpoints

```javascript
// Mobile first
@media (max-width: 480px)   // Small phones
@media (max-width: 768px)   // Tablets
@media (max-width: 1024px)  // Small laptops
@media (min-width: 1025px)  // Desktop
```

---

## 🚀 Deployment Checklist

- [ ] All JSON translation files are valid
- [ ] No hardcoded strings in components
- [ ] hreflang tags added to layout
- [ ] Language switcher works all three languages
- [ ] RTL/LTR layouts tested
- [ ] Mobile responsive tested
- [ ] Fonts loaded correctly
- [ ] Translations gzipped
- [ ] Performance > 90 Lighthouse score

---

## 📊 Language Codes

| Code | Language | Direction | Native Name |
|------|----------|-----------|-------------|
| en   | English  | LTR       | English     |
| ar   | Arabic   | RTL       | العربية     |
| zh   | Chinese  | LTR       | 中文        |

---

## 🔗 File Locations

```
Translation files: /public/locales/[lang]/common.json
Hook:            /hooks/useTranslation.js
Utils:           /lib/localization.js
Switcher:        /components/LanguageSwitcher.jsx
Example:         /components/TrilingualExample.jsx
Docs:            /CHINESE_LOCALIZATION_GUIDE.md
```

---

## 💡 Pro Tips

1. **Always use `useTranslation()` hook** instead of importing JSON directly
2. **Use CSS logical properties** (`margin-inline-start`, etc.) for RTL support
3. **Test in all three languages** before deploying
4. **Use `dir={isRTL ? "rtl" : "ltr"}` on main containers**
5. **Import Chinese fonts** from Google Fonts for better rendering
6. **Submit sitemap to Baidu** if targeting Chinese users
7. **Use `formatDate()` for locale-aware date formatting**
8. **Test on mobile devices** - language switcher is touch-optimized

---

## ❌ Common Mistakes to Avoid

```jsx
// ❌ Don't do this
const message = "Hello";  // Hardcoded

// ✅ Do this
const { t } = useTranslation();
const message = t('general.welcome');

// ❌ Don't break RTL
<div style={{ marginLeft: '1rem' }}>

// ✅ Use logical properties
<div style={{ marginInlineStart: '1rem' }}>

// ❌ Don't forget text direction
<div>{content}</div>

// ✅ Set direction
<div dir={isRTL ? "rtl" : "ltr"}>{content}</div>
```

---

## 🆘 Quick Help

| Problem | Solution |
|---------|----------|
| Chinese characters broken | Add Noto Sans SC font import |
| Translations show as keys | Check JSON syntax and file paths |
| RTL breaks layout | Use CSS logical properties |
| Language doesn't switch | Verify URL routing is `/[lang]/page` |
| Performance slow | Check font loading, use display: 'swap' |

---

**Print this card or bookmark it for quick reference while developing!** 📌
