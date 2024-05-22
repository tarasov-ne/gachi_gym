import { Link } from "react-router-dom";
import "./AdminPageNavbar.css";

export default function AdminPageNavbar() {
  return (
    <div className="adminPageNavbar">
      <Link to={"/admin-page/"}>
        <div>Dashboard</div>
      </Link>
      <Link to={"/admin-page/add-user"}>
        <div>Add User</div>
      </Link>
      <Link to={"/admin-page/add-trainer"}>
        <div>Add Trainer</div>
      </Link>
      <Link to={"/admin-page/add-product"}>
        <div>Add Product</div>
      </Link>
      <Link to={"/admin-page/add-membership"}>
        <div>Add Membership</div>
      </Link>
    </div>
  );
}
