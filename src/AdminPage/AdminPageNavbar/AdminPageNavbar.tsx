import { Link } from "react-router-dom";
import "./AdminPageNavbar.css";

export default function AdminPageNavbar() {
  return (
    <div className="adminPageNavbar">
      <Link to={"/admin-page/"}>
        <div>Таблицы</div>
      </Link>
      <Link to={"/admin-page/info"}>
        <div>Статистика</div>
      </Link>
      <Link to={"/admin-page/add-user"}>
        <div>Добавление клиента</div>
      </Link>
      <Link to={"/admin-page/add-trainer"}>
        <div>Добавление тренера</div>
      </Link>
      <Link to={"/admin-page/add-product"}>
        <div>Добавление товара</div>
      </Link>
      <Link to={"/admin-page/add-membership"}>
        <div>Добавление абонемента</div>
      </Link>
    </div>
  );
}
