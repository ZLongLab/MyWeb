export default function NotFoundPage() {
  return (
    <main className="container lost-main" id="main">
      <svg
        className="lost-door"
        viewBox="0 0 64 72"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="M13 65V9h37v56M9 65h47M23 65V17l20-5v53M35 38h1" />
      </svg>
      <p className="eyebrow">404 / ROOM NOT FOUND</p>
      <h1>这里，还没有这间房。</h1>
      <p>
        地址可能写错了，也可能是东西搬了位置。
        <br />
        从下面的门进去，或者搜索一下。
      </p>
      <nav className="site-nav lost-map" id="site-nav" aria-label="小站平面图">
        <a href="index.html">玄关 / 首页</a>
        <a href="projects.html">客厅 / 作品</a>
        <a href="articles.html">书房 / 记录</a>
        <a href="workbench.html">工作台</a>
        <a href="life.html">院子</a>
      </nav>
    </main>
  );
}
