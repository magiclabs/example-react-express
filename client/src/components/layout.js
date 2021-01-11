import Header from './header';

const Layout = (props) => (
  <>
    <Header />
    <main>
      <div className='container'>{props.children}</div>
    </main>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300&display=swap');
      *,
      *::before,
      *::after {
        font-family: 'Inter', sans-serif;
        outline: none;
      }
      body {
        margin: 0;
        color: #333;
        background-color: #fff;
      }
      .container {
        max-width: 42rem;
        margin: 0 auto;
      }
    `}</style>
  </>
);

export default Layout;
