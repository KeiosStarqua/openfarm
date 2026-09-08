import Link from "next/link"
import { SiteFooter, SiteHeader } from "@/components/SiteChrome"

export default function HomePage() {
  return (
    <div className="page">
      <SiteHeader current="/" />
      <main>
        <section className="hero">
          <p className="kicker">Blockchain cho lòng tin nông sản</p>
          <h1>
            Người mua gặp được
            <br />
            nông dân đã trồng ra
            <br />
            thứ họ cầm trên tay.
          </h1>
          <p className="lede">
            Nông dân thu thập dữ liệu quá trình trồng trọt và sản xuất. Mỗi mùa
            vụ trở thành một Harvest Story trên Sui. Quét QR trên sản phẩm là
            đọc được cả ruộng.
          </p>
          <div className="actions">
            <Link className="btn clay" href="/nong-dan">
              Tôi là nông dân — ghi nhật ký
            </Link>
            <Link className="btn moss" href="/cau-chuyen/ruong-nha-bay">
              Tôi là người mua — đọc mùa vụ mẫu
            </Link>
          </div>
        </section>

        <section className="split">
          <div>
            <h2>Vấn đề</h2>
            <p>
              Thực phẩm đi rất xa khỏi ruộng. Người tiêu dùng chỉ còn nhãn hiệu.
              Nông dân mất mặt, mất lời kể, mất lòng tin.
            </p>
          </div>
          <div>
            <h2>Cách OpenFarm làm</h2>
            <p>
              Nông dân ghi sự kiện khi đang làm: gieo, tưới, bón, kiểm tra sâu
              bệnh, thời tiết, thu hoạch, đóng gói. Ảnh và video nằm trên
              Walrus. Khi chốt mùa, câu chuyện khóa lại cho người mua đọc.
            </p>
          </div>
        </section>

        <ol className="steps">
          <li>
            <strong>Ghi trên ruộng</strong>
            Nông dân tạo Passport, đăng ký thửa, mở mùa vụ, ghi từng việc đã làm.
          </li>
          <li>
            <strong>Chốt thành Story</strong>
            Harvest Story là bản công khai, không sửa. Lô sản phẩm trỏ về đó.
          </li>
          <li>
            <strong>Người mua đọc</strong>
            QR trên bao bì mở đúng nông dân, ruộng, và dòng thời gian sản xuất.
          </li>
        </ol>

        <section className="cta-band">
          <h2>Xem một mùa lúa An Giang</h2>
          <p>
            Ruộng nhà Bảy đã ghi từ ngày cấy ST25 đến ngày đóng bao. Đó là mẫu
            cho việc người tiêu dùng đến gần nông dân.
          </p>
          <Link className="btn clay" href="/cho">
            Vào chợ câu chuyện
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
