import { Button, DatePicker, Form, Input, Select, Modal } from 'antd';
import React from 'react';

function AddExpense({ isExpenseModalVisible, handleExpenseCancel, onFinish }) {
  const [form] = Form.useForm();

  return (
    <Modal 
      title="Add Expense"
      onCancel={handleExpenseCancel}
      open={isExpenseModalVisible} 
      footer={null}
    >
      <Form
        form={form}
        layout="vertical" 
        onFinish={(values) => { 
          onFinish(values, "expenses"); 
          form.resetFields();
        }}
      >
        <Form.Item
          label="Name"
          name="Name"
          rules={[
            {
              required: true,
              message: "Please input the name of transaction",
            },
          ]}
        >
          <Input type="text" className="custom-input" />
        </Form.Item>

        <Form.Item
          label="Amount"
          name="amount"
          rules={[
            {
              required: true,
              message: "Please input the expense amount",
            },
          ]}
        >
          <Input type="number" className="custom-input" min={1} />
        </Form.Item>
        
        <Form.Item
          label="Date"
          name="date"
          rules={[
            {
              required: true,
              message: "Please input the expense date",
            },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" className="custom-input" />
        </Form.Item>

        <Form.Item
          label="Tag"
          name="tag"
          rules={[
            {
              required: true,
              message: "Please select the tags",
            },
          ]}
        >
          <Select className="select-input-2">
            <Select.Option value="food">Food & grocery</Select.Option>
            <Select.Option value="education">Education</Select.Option>
            <Select.Option value="shopping">Shopping</Select.Option>
            <Select.Option value="entertainment">Entertainment</Select.Option>
            <Select.Option value="bills">Bills</Select.Option>
            <Select.Option value="otherExpenses">Other-expenses</Select.Option> 
          </Select>
        </Form.Item>
        
        <Form.Item>
          <Button
            className="btn btn-blue"
            type="primary"
            htmlType="submit"
          >
            Add Expense
          </Button>
        </Form.Item>

      </Form>
    </Modal> 
  );
}

export default AddExpense;
