import apiAxiosInstance from "../api/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import "./PurchasePage.css";
import { useState } from "react";
import Popup from "reactjs-popup";
import Slider from "@mui/material/Slider";
import { queryClient } from "../main";
import { toast } from "react-toastify";
import { useAtom } from "jotai";
import { clientAtom } from "../App";
import moment from "moment";

export default function PurchasePage() {
  const [selectedProduct, setSelectedProduct] = useState<TProduct | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [clientInfo] = useAtom(clientAtom)
  const { data: products } = useQuery({
    queryKey: ["products_all"],
    queryFn: async () => {
      const res = await apiAxiosInstance.get("/getData");
      return res.data.Product as TProduct[];
    },
    refetchInterval: 5 * 60 * 1000,
    refetchIntervalInBackground: true,
  });

  const handlePurchase = (product: TProduct) => {
    setSelectedProduct(product);
  };

  const handleQuantityChange = (event: Event, value: number | number[]) => {
    setQuantity(Array.isArray(value) ? value[0] : value);
  };

  const handleConfirmPopup = useMutation({
    mutationFn: (values: any) => apiAxiosInstance.post("/purchaseInsert", values),
    onMutate: async (values: any) => {
      await queryClient.cancelQueries({ queryKey: ["purchase_all"] });
      const previousPurchaseData = queryClient.getQueryData([
        "purchase_all",
      ]) as TProduct[];
      if (previousPurchaseData)
        queryClient.setQueryData(
          ["purchase_all"],
          [...previousPurchaseData, values]
        );
      return { previousPurchaseData };
    },

    mutationKey: ["purchase_insert"],

    onError: (_err, _variables, context) => {
      if (context?.previousPurchaseData) {
        queryClient.setQueryData<TProduct[]>(
          ["purchase_all"],
          context.previousPurchaseData as TProduct[]
        );
      }
    },
    onSuccess: () => {
      toast.success("Покупка совершена успешно!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products_all"] });
      handleClosePopup();
    },
  });

  const handleClosePopup = () => {
    setSelectedProduct(null);
    setQuantity(1);
  };

  const calculateTotalPrice = (): number => {
    if (selectedProduct) {
      return selectedProduct.price * quantity;
    }
    return 0;
  };

  return (
    <div className="product-listing">
      <h1>Список доступных товаров</h1>
      <div className="products">
        {products?.map((product) => (
          <div key={product.id} className="product-card">
            <h2>{product.name}</h2>
            <p>Цена: {product.price} рублей</p>
            <p>Доступно: {product.count}</p>
            <button onClick={() => handlePurchase(product)}>Приобрести</button>
          </div>
        ))}
      </div>

      <Popup open={!!selectedProduct} onClose={handleClosePopup}>
        <div className="popup">
          {selectedProduct && (
            <>
              <h2>{selectedProduct.name}</h2>
              <p>Цена за штуку: {selectedProduct.price} рублей</p>
              <p>Выбранное количество: {quantity}</p>
              <Slider
                value={quantity}
                min={1}
                max={selectedProduct.count}
                step={1}
                onChange={handleQuantityChange}
                aria-labelledby="quantity-slider"
              />
              <p>Итоговая стоимость: {calculateTotalPrice()} рублей</p>
              <button
                onClick={() => {
                  handleConfirmPopup.mutate({
                    client_id: clientInfo.id,
                    product_id: selectedProduct.id,
                    date: moment().format('YYYY-MM-DD'),
                    time: moment().format('HH:mm:ss'),
                    quantity: quantity,
                    total_price: calculateTotalPrice()
                  });
                }}
              >
                Подтвердить
              </button>
              <button onClick={handleClosePopup}>Закрыть</button>
            </>
          )}
        </div>
      </Popup>
    </div>
  );
}
