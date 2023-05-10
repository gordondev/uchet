import React, { useContext } from 'react'
import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Result, Typography, message } from 'antd';
import { Context } from "../index";
import { logout } from "../http/userAPI";
import { observer } from "mobx-react-lite";

const { Paragraph, Text } = Typography;

const AccountLock = observer(() => {
	const { user } = useContext(Context);

	const logOut = async () => {
    try {
      await logout();
      user.setUser({});
      user.setIsAuth(false);
      user.setLocked(false);
      localStorage.removeItem("token");
    } catch (e) {
      message.error(e.response?.data?.message);
    }
  };

	return (
		<section className="auth">
      		<div className="container">
      			<Result
			    status="error"
			    title="Доступ заблокирован"
			    subTitle="Пожалуйста обратитесь у руководству или войдите с другого аккаунта"
			    extra={[
			      <Button type="primary" key="console" onClick={logOut}>
			        Выйти
			      </Button>,
			    ]}
			  >
			  </Result>
	      	</div>
	    </section>
	)
});

export default AccountLock