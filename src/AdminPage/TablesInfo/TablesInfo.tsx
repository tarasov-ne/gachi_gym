import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiAxiosInstance from '../../api/axios';
import moment from 'moment';
import './TablesInfo.css';

type TTrainingReg = {
    id: number;
    client: TClientData;
    trainer: TTrainerData;
    date: string;
    start: string;
    end: string;
}

export default function TablesInfo() {
  const { data: clients } = useQuery<TClientData[]>({
    queryKey: ['clients_all'],
    queryFn: async () => {
      const res = await apiAxiosInstance.get('/getClients');
      return res.data;
    },
  });

  const { data: memberships } = useQuery<TMemberShip[]>({
    queryKey: ['memberships_all'],
    queryFn: async () => {
      const res = await apiAxiosInstance.get('/getMemberships');
      return res.data;
    },
  });

  const { data: membershipRegs } = useQuery<TMemberShipReg[]>({
    queryKey: ['membershipRegs_all'],
    queryFn: async () => {
      const res = await apiAxiosInstance.get('/getMembershipRegistrations');
      return res.data;
    },
  });

  const { data: products } = useQuery<TProduct[]>({
    queryKey: ['products_all'],
    queryFn: async () => {
      const res = await apiAxiosInstance.get('/getProducts');
      return res.data;
    },
  });

  const { data: purchases } = useQuery<TPurchase[]>({
    queryKey: ['purchases_all'],
    queryFn: async () => {
      const res = await apiAxiosInstance.get('/getPurchases');
      return res.data;
    },
  });

  const { data: trainers } = useQuery<TTrainerData[]>({
    queryKey: ['trainers_all'],
    queryFn: async () => {
      const res = await apiAxiosInstance.get('/getTrainers');
      return res.data;
    },
  });

  const { data: trainingRegs } = useQuery<TTrainingReg[]>({
    queryKey: ['trainingRegs_all'],
    queryFn: async () => {
      const res = await apiAxiosInstance.get('/getTrainingRegistrations');
      return res.data;
    },
  });

  const { data: visitStatistics } = useQuery<TVisitStatisticData[]>({
    queryKey: ['visitStatistics_all'],
    queryFn: async () => {
      const res = await apiAxiosInstance.get('/getVisitStatistics');
      return res.data;
    },
  });

  // Calculations
  const activeClients = clients?.filter(client => client.membership_active).length || 0;    
  const totalProductRevenue = useMemo(() => {
    return purchases?.reduce((total, purchase) => total + purchase.total_price, 0) || 0;
  }, [purchases]);

  const totalMembershipRevenue = useMemo(() => {
    return membershipRegs?.reduce((total, reg) => {
      const membership = memberships?.find(m => m.id === reg.membership_id);
      return membership ? total + membership.price : total;
    }, 0) || 0;
  }, [membershipRegs, memberships]);
  
  const totalProductsSold = useMemo(() => purchases?.reduce((total, purchase) => total + purchase.quantity, 0) || 0, [purchases]);
  const totalRevenue = totalProductRevenue + totalMembershipRevenue;
  const totalTrainers = trainers?.length || 0;
  const totalTrainings = trainingRegs?.length || 0;
  const totalVisits = visitStatistics?.length || 0;

  // Additional Calculations
  const activeClientsInTraining = trainingRegs?.filter(reg => moment(reg.date).isSame(moment(), 'day')).length || 0;

  const trainerPopularity = useMemo(() => {
    const trainerCount: { [key: number]: number } = {};
    trainingRegs?.forEach(reg => {
      if (trainerCount[reg.trainer.id]) {
        trainerCount[reg.trainer.id]++;
      } else {
        trainerCount[reg.trainer.id] = 1;
      }
    });
    return trainers?.map(trainer => ({
      ...trainer,
      clients: trainerCount[trainer.id] || 0,
    })) || [];
  }, [trainers, trainingRegs]);

  const popularProducts = useMemo(() => {
    const productCount: { [key: number]: number } = {}; 
    purchases?.forEach(purchase => {
      if (productCount[purchase.product_id]) {
        productCount[purchase.product_id] += purchase.quantity;
      } else {
        productCount[purchase.product_id] = purchase.quantity;
      }
    });
    return products?.map(product => ({
      ...product,
      sold: productCount[product.id] || 0,
    })).sort((a, b) => b.sold - a.sold) || [];
  }, [products, purchases]);

  const averageVisitDuration = useMemo(() => {
    if (!visitStatistics?.length) return 0;
  
    const totalMinutes = visitStatistics.reduce((sum, visit) => {
      const startDate = moment(visit.start_date).format('YYYY-MM-DD');
      const endDate = moment(visit.end_date).format('YYYY-MM-DD');
  
      const daysDiff = moment(endDate, 'YYYY-MM-DD').diff(moment(startDate, 'YYYY-MM-DD'), 'days');

      const startTime = moment(visit.start_time, 'HH:mm:ss');
      const endTime = moment(visit.end_time, 'HH:mm:ss');
      const timeDiff = endTime.diff(startTime, 'minutes');

      const totalDiff = daysDiff * 24 * 60 + timeDiff;
  
      return sum + totalDiff;
    }, 0);
  
    return totalMinutes / visitStatistics.length;
  }, [visitStatistics]);
  
  const expiringMembershipsNextMonth = useMemo(() => {
    const nextMonth = moment().add(1, 'month');
    return membershipRegs?.filter(reg => moment(reg.end_date).isBefore(nextMonth)).length || 0;
  }, [membershipRegs]);

  const today = moment().startOf('day');
  const dailyProductRevenue = useMemo(() => {
    return purchases?.reduce((total, purchase) => {
      if (moment(purchase.date).isSame(today, 'day')) {
        return total + purchase.total_price;
      }
      return total;
    }, 0) || 0;
  }, [purchases, today]);

  const dailyMembershipRevenue = useMemo(() => {
    return membershipRegs?.reduce((total, reg) => {
      const membership = memberships?.find(m => m.id === reg.membership_id);
      if (membership && moment(reg.start_date).isSame(today, 'day')) {
        return total + membership.price;
      }
      return total;
    }, 0) || 0;
  }, [membershipRegs, memberships, today]);

  const totalDailyRevenue = dailyProductRevenue + dailyMembershipRevenue;

  return (
    <div className="container">
      <h2>Статистика спортзала</h2>
      <ul>
        <li><span>Активных клиентов:</span> {activeClients}</li>
        <li><span>Общий доход от продаж (в рублях):</span> {totalRevenue}</li>
        <li><span>Доход за текущий день (в рублях):</span> {totalDailyRevenue}</li>
        <li><span>Всего продано товаров:</span> {totalProductsSold}</li>
        <li><span>Всего тренеров:</span> {totalTrainers}</li>
        <li><span>Всего проведено занятий:</span> {totalTrainings}</li>
        <li><span>Всего посещений:</span> {totalVisits}</li>
        <li><span>Количество занятий сегодня:</span> {activeClientsInTraining}</li>
        <li><span>Средняя длительность посещения (в минутах):</span> {averageVisitDuration}</li>
        <li><span>Число клиентов с абонементами, истекающими в ближайший месяц:</span> {expiringMembershipsNextMonth}</li>
      </ul>
      <h3>Популярность тренеров (количество записей)</h3>
      <ul>
        {trainerPopularity.map(trainer => (
          <li key={trainer.id}><span>{trainer.name} {trainer.surname}:</span> {trainer.clients}</li>
        ))}
      </ul>
      <h3>Популярность товаров (продано)</h3>
      <ul>
        {popularProducts.map(product => (
          <li key={product.id}><span>{product.name}:</span> {product.sold}</li>
        ))}
      </ul>
      <div className="footer">Актуально на {moment().format('DD.MM.YYYY, HH:mm:ss')}</div>
    </div>
  );
}
