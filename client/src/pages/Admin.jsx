import React, { useState, useEffect } from "react";
import { Table, Button } from 'antd';
import { getAllUsers } from "../http/userAPI";
import { observer } from "mobx-react-lite";
import { DeleteOutlined, LockOutlined, EditOutlined } from "@ant-design/icons";

const Admin = observer(() => {

  const [isLoadind, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);

  console.log(users);

  useEffect(() => {
    setIsLoading(true);
    getAllUsers().then((data) => setUsers(data));
    setIsLoading(false);
  }, []);

  console.log(users);


  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      filters: [
        {
          text: 'USER',
          value: 'USER',
        },
        {
          text: 'ADMIN',
          value: 'ADMIN',
        },
      ]
    },
    {
      title: 'Подразделение',
      dataIndex: 'division',
      width: 170,
      filters: [
        {
          text: 'ТЦ-3',
          value: 'ТЦ-3',
        },
        {
          text: 'РЦ-2',
          value: 'РЦ-2',
        },
        {
          text: 'РЦ-3',
          value: 'РЦ-3',
        },
        {
          text: 'ЦЦР',
          value: 'ЦЦР',
        },
        {
          text: 'ЦОРО',
          value: 'ЦОРО',
        },
        {
          text: 'ЭЦ',
          value: 'ЭЦ',
        },
        {
          text: 'ЦТАИ',
          value: 'ЦТАИ',
        },
        {
          text: 'ЦВ',
          value: 'ЦВ',
        },
        {
          text: 'ОРБ',
          value: 'ОРБ',
        },
        {
          text: 'ХЦ',
          value: 'ХЦ',
        },
        {
          text: 'ТЦ-2',
          value: 'ТЦ-2',
        },
        {
          text: 'РТЦ-1',
          value: 'РТЦ-1',
        },
        {
          text: 'ЦОС',
          value: 'ЦОС',
        },
        {
          text: 'ОПБ',
          value: 'ОПБ',
        },
        {
          text: 'ОЯБиН',
          value: 'ОЯБиН',
        },
        {
          text: 'Управление',
          value: 'Управление',
        },
        {
          text: 'ОТИиПБ',
          value: 'ОТИиПБ',
        },
        {
          text: 'ОИиКОБ',
          value: 'ОИиКОБ',
        },
        {
          text: 'ООТ',
          value: 'ООТ',
        },
        {
          text: 'УТП',
          value: 'УТП',
        },
      ],
      onFilter: (value, record) => record.address.indexOf(value) === 0,
    },
    {
      title: 'Имя',
      dataIndex: 'name',
    },
    {
      title: 'Фамилия',
      dataIndex: 'surname',
    },
    {
      title: 'Отчество',
      dataIndex: 'patronymic',
    },
    {
      title: 'Действие',
      dataIndex: '',
      key: 'x',
      width: 170,
      render: () => <Button
                        type="primary"
                        icon={<EditOutlined />}
                      >
                        Редактировать
                    </Button>,
    },
    {
      title: 'Действие',
      dataIndex: '',
      key: 'x',
      render: () => <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                      >
                        Удалить
                    </Button>,
    },
    {
      title: 'Действие',
      dataIndex: '',
      key: 'x',
      render: () => <Button
                        type="primary"
                        danger
                        icon={<LockOutlined />}
                      >
                        Заблокировать
                    </Button>,
    },
  ];

  return (
    <section className="searchSection">
      <div className="container">
        <Table columns={columns} size="middle" dataSource={users} 
        pagination={{
          pageSize: 10,
        }}
        scroll={{
          y: 440,
        }}
        loading={isLoadind}
        />
      </div>
    </section>
  );
});

export default Admin;
