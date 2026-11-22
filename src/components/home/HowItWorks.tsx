import Container from "@/components/shared/Container";
const steps = [
  ["Find your item", "Compare products, options and seller information before choosing."],
  ["Review your order", "Enter your delivery details, check the charges and choose cash on delivery."],
  ["Follow up easily", "Use order tracking or contact our team when you need an update."],
];
export default function HowItWorks() {
  return <section className="shop-how"><Container><div className="shop-section-heading"><p className="shop-eyebrow">How shopping works</p><h2>From your first find to your order.</h2></div><ol>{steps.map(([title,text],i)=><li key={title}><span>0{i+1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol></Container></section>;
}
