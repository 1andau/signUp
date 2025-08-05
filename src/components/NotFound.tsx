import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div>
      <h1>404 - Страница не найдена</h1>
      <p>Извините, запрошенная страница не существует.</p>
      <Link to="/">Вернуться на главную</Link>
    </div>
  );
};

export default NotFound;