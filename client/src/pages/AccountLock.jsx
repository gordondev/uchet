import React from 'react'
import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Result, Typography } from 'antd';
const { Paragraph, Text } = Typography;

const AccountLock = () => {
	return (
		<section className="auth">
      		<div className="container">
      			<Result
			    status="error"
			    title="Доступ заблокирован"
			    subTitle="Пожалуйста обратитесь у руководству или войдите с другого аккаунта"
			    extra={[
			      <Button type="primary" key="console">
			        Выйти
			      </Button>,
			    ]}
			  >
			  </Result>
	      	</div>
	    </section>
	)
}

export default AccountLock