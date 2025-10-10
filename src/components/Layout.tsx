import Header from './Header';
// import Footer from './Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div style={{ paddingTop: '80px' }}>{children}</div>
      {/* <Footer /> */}
    </>
  );
}