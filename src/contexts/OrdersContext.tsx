import { useToast } from '@chakra-ui/react';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import Repository from '$libs/Repository';
import { formatAmount } from '$utils/formatters';
import { getUserPermissions } from '$utils/getUserPermissions';
import { getUserAge } from '$utils/getUserAge';

import { useAuth } from './AuthContext';

export interface Drink {
  uuid: string;
  name: string;
  picture: string;
  price: number;
  alcoholic: boolean;
}

export type Items = Record<
  string,
  { priceFormatted: string; amount: number } & Drink
>;

export interface NewOrder {
  drinks: Drink[];
}

export interface OrdersContextParams {
  items: Items;
  hasOrder: boolean;
  addDrinkToNewOrder: (drink: Drink) => boolean;
  clearNewOrder: () => void;
}

interface OrdersProviderProps {
  children: ReactNode;
}

export type NewOrders = Record<string, NewOrder>;

const NEW_ORDERS_KEY = '@SkyBar/NewOrders';
const MAIORITY = 18;

export interface AddDrinkToNewOrderParams {
  drink: Drink;
  email: string;
}

export const OrdersContext = createContext({} as OrdersContextParams);

export function OrdersProvider({ children }: OrdersProviderProps) {
  const [items, setItems] = useState<Items>({});
  const [newOrders, setNewOrders] = useState<NewOrders>({} as NewOrders);
  const toast = useToast();

  const { user } = useAuth();

  const email = String(user?.email);

  const { isUser } = getUserPermissions(user?.role);

  const hasOrder = Object.keys(items || {}).length > 0;

  useEffect(() => {
    const newOrders = Repository.get<NewOrders>(NEW_ORDERS_KEY) || {
      [email]: { drinks: [] },
    };

    if (!newOrders[email]) {
      newOrders[email] = { drinks: [] };
    }

    setNewOrders(newOrders);

    const newOrder = newOrders[email];

    if (newOrder) {
      const drinksItems = newOrder.drinks.reduce((items, drink) => {
        const item = items[drink.uuid];

        if (item) {
          return {
            ...items,
            [drink.uuid]: { ...item, amount: item.amount + 1 },
          };
        }

        return {
          ...items,
          [drink.uuid]: {
            ...drink,
            priceFormatted: formatAmount(drink.price),
            amount: 1,
          },
        };
      }, {} as Items);

      setItems(drinksItems);
    }
  }, [email]);

  const addDrinkToNewOrder = useCallback(
    (drink: Drink) => {
      if (!isUser) {
        toast({
          status: 'warning',
          title: 'Bebida n??o adicionada',
          isClosable: true,
          duration: 5000,
          description:
            '?? necess??rio ser um usu??rio para adicionar bebidas ao pedido',
        });

        return false;
      }

      const userAge = getUserAge(user?.birthDay);

      if (userAge < MAIORITY && drink.alcoholic) {
        toast({
          status: 'warning',
          title: 'Bebida n??o adicionada',
          isClosable: true,
          duration: 5000,
          description:
            'Voc?? precisa ser maior de idade para adicionar uma bebida alco??lica.',
        });

        return false;
      }

      newOrders[email].drinks.push(drink);

      Repository.save(NEW_ORDERS_KEY, newOrders);

      setItems((items) => {
        const item = items[drink.uuid];

        if (item) {
          return {
            ...items,
            [drink.uuid]: { ...item, amount: item.amount + 1 },
          };
        }

        return {
          ...items,
          [drink.uuid]: {
            ...drink,
            priceFormatted: formatAmount(drink.price),
            amount: 1,
          },
        };
      });

      return true;
    },
    [email, newOrders, isUser, toast, user],
  );

  const clearNewOrder = useCallback(() => {
    Repository.save(NEW_ORDERS_KEY, {
      ...newOrders,
      [email]: { drinks: [] },
    });

    setItems({});
  }, [email, newOrders]);

  return (
    <OrdersContext.Provider
      value={{
        items,
        hasOrder,
        addDrinkToNewOrder,
        clearNewOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrdersContext);
}
