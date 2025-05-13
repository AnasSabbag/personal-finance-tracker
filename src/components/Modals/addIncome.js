import { Button, DatePicker, Form, Input, Select,Modal } from 'antd';
import React from 'react'

function AddIncome({
  isIncomeModalVisible,
  handleIncomeCancel,
  onFinish,
}) {

  const [form]= Form.useForm();

  return (
    <Modal 
        title="Add Income"
        onCancel={handleIncomeCancel}
        open={isIncomeModalVisible}
        footer={null}
      >
      
      <Form
        form={form}
        layout='vertical'
        onFinish={(values)=>{
          onFinish(values,"incomes");
          form.resetFields();
        }}
      >
        <Form.Item
          label="Name"
          name="Name"
          rules={[
            {
              required:true,
              message:"Please input the name of transaction ",
            },
          ]}
        >
          <Input type='text' className='custom-input' />
        </Form.Item>

        <Form.Item
          label="Amount"
          name="amount"
          rules={[
            {
              required:true,
              message:"Please input the income amount ",
            },
          ]}
        >
          <Input type='number' className='custom-input'  min={1} />
        </Form.Item>
        
        <Form.Item
          label="Date"
          name="date"
          rules={[
            {
              required:true,
              message:"Please input the income date ",
            },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" className='custom-input' />
        </Form.Item>

        <Form.Item
          label="Tag"
          name="tag"
          rules={[
            {
              required:true,
              message:"Please select the tags ",
            },
          ]}
        >
          
          <Select className='select-input-2' >
            <Select.Option value="salary" >Salary</Select.Option>
            <Select.Option value="freelance" >Freelance</Select.Option>
            <Select.Option value="investment" >Investment</Select.Option>
            <Select.Option value="saving" >Savings</Select.Option>   
            <Select.Option value="others" >Others</Select.Option>
          </Select>

        </Form.Item>
        
        <Form.Item>
          <Button
            className='btn btn-blue'
            type='primary'
            htmlType='submit'
          >
            AddIncome
          </Button>

        </Form.Item>

      </Form>

    </Modal>

    
  )
}

export default AddIncome;