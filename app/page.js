'use client';
import { useState } from 'react';
import { Form, Input, Select, Button, Card, DatePicker, Divider, Typography, message } from 'antd';
import dayjs from 'dayjs';
import { getLogoDesign } from '@/lib/designRules';
import LogoPreview from '@/components/LogoPreview';
import ErrorBoundary from '@/components/ErrorBoundary';
import { patternNames } from '@/lib/patternUtils';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

export default function LogoGenerator() {
  const [form] = Form.useForm();
  const [logoData, setLogoData] = useState(null);
  const [designConfig, setDesignConfig] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    
    try {
      // 格式化生日日期
      const formattedData = {
        ...values,
        birthday: values.birthday ? dayjs(values.birthday).format('YYYY-MM-DD') : null
      };
      
      setLogoData(formattedData);
      
      // 使用设计规则引擎生成设计配置
      const config = await getLogoDesign(formattedData);
      setDesignConfig(config);
      
      message.success('Logo生成成功！');
    } catch (error) {
      console.error('生成Logo时出错:', error);
      message.error('生成Logo时出错，请重试');
      
      // 提供默认配置以防出错
      setDesignConfig({
        layout: "1x1",
        patternType: 0,
        complexity: 2,
        feature1: 0,
        feature2: 0,
        feature3: 0,
        rotation: 0,
        scale: 0.8,
        colors: { primary: "#1890ff", secondary: "#f0f5ff", accent: "#096dd9" },
        footerText: "Bionic Metamaterials"
      });
    } finally {
      setLoading(false);
    }
  };

  // 颜色选项数组
  const colorOptions = [
    { value: 'red', label: '红色', color: '#ff4d4f' },
    { value: 'blue', label: '蓝色', color: '#1890ff' },
    { value: 'green', label: '绿色', color: '#52c41a' },
    { value: 'yellow', label: '黄色', color: '#fadb14' },
    { value: 'purple', label: '紫色', color: '#722ed1' },
    { value: 'orange', label: '橙色', color: '#fa8c16' },
    { value: 'pink', label: '粉色', color: '#eb2f96' },
    { value: 'cyan', label: '青色', color: '#13c2c2' },
  ];

  return (
    <ErrorBoundary>
      <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
        <Title level={1} style={{ textAlign: 'center', marginBottom: '24px' }}>
          仿生超材料课题组图案设计
        </Title>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* 左侧：表单 */}
          <Card title="请输入您的个性化信息">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              disabled={loading}
            >
              <Form.Item
                name="initials"
                label="姓名缩写"
                rules={[{ required: true, message: '请输入您的姓名缩写' }]}
                tooltip="例如：张三的缩写为 ZS"
              >
                <Input 
                  placeholder="请输入您的姓名拼音首字母" 
                  maxLength={4}
                  style={{ textTransform: 'uppercase' }}
                />
              </Form.Item>

              <Form.Item
                name="birthday"
                label="生日"
                rules={[{ required: true, message: '请选择您的生日' }]}
                tooltip="生日将用于生成独特的图案参数"
              >
                <DatePicker 
                  placeholder="请选择您的生日" 
                  style={{ width: '100%' }} 
                />
              </Form.Item>

              <Form.Item
                name="favoriteColor"
                label="喜欢的颜色"
                rules={[{ required: true, message: '请选择您喜欢的颜色' }]}
              >
                <Select placeholder="请选择您喜欢的颜色">
                  {colorOptions.map(color => (
                    <Option key={color.value} value={color.value}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div 
                          style={{ 
                            width: '16px', 
                            height: '16px', 
                            backgroundColor: color.color, 
                            marginRight: '8px',
                            borderRadius: '2px'
                          }} 
                        />
                        {color.label}
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="hobbies"
                label="兴趣爱好"
                rules={[{ required: true, message: '请输入您的兴趣爱好' }]}
                tooltip="多个爱好可以用逗号分隔"
              >
                <TextArea 
                  rows={3} 
                  placeholder="例如：阅读,旅行,音乐,摄影,运动..." 
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  size="large" 
                  block
                  loading={loading}
                >
                  {loading ? '生成中...' : '生成我的个性Logo'}
                </Button>
              </Form.Item>
            </Form>
          </Card>

          {/* 右侧：Logo预览 */}
          <Card title="Logo预览">
            {designConfig ? (
              <LogoPreview designConfig={designConfig} initials={logoData?.initials} />
            ) : (
              <div style={{ 
                height: '300px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#999',
                flexDirection: 'column'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎨</div>
                <p>填写左侧表单并点击{"生成"}按钮</p>
                <p>即可查看您的个性化Logo</p>
              </div>
            )}
          </Card>
        </div>

        {/* 设计配置详情 */}
        {designConfig && (
          <Card title="设计详情" style={{ marginTop: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <Title level={5}>原始数据</Title>
                <Divider />
                <p><strong>姓名缩写:</strong> {logoData.initials}</p>
                <p><strong>生日:</strong> {logoData.birthday}</p>
                <p><strong>喜欢的颜色:</strong> {logoData.favoriteColor}</p>
                <p><strong>兴趣爱好:</strong> {logoData.hobbies}</p>
              </div>
              
              
              <div>
                <Title level={5}>图案配置</Title>
                <Divider />
                <p><strong>图案类型:</strong> {patternNames[designConfig.patternType] || "方形螺旋"}</p>
                <p><strong>复杂度:</strong> {designConfig.complexity}级</p>
                <p><strong>旋转角度:</strong> {designConfig.rotation}°</p>
                {/* 移除缩放比例的显示 */}
                <p><strong>布局:</strong> {designConfig.layout}</p>
              </div>
              
              <div>
                <Title level={5}>颜色方案</Title>
                <Divider />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: designConfig.colors.primary,
                      marginRight: '8px',
                      borderRadius: '4px'
                    }}></div>
                    <span>主色: {designConfig.colors.primary}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: designConfig.colors.secondary,
                      marginRight: '8px',
                      borderRadius: '4px'
                    }}></div>
                    <span>背景色: {designConfig.colors.secondary}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: designConfig.colors.accent,
                      marginRight: '8px',
                      borderRadius: '4px'
                    }}></div>
                    <span>强调色: {designConfig.colors.accent}</span>
                  </div>
                </div>
              </div>

              <div>
                <Title level={5}>特征参数</Title>
                <Divider />
                <p><strong>特征1:</strong> {designConfig.feature1}</p>
                <p><strong>特征2:</strong> {designConfig.feature2}</p>
                <p><strong>特征3:</strong> {designConfig.feature3}</p>
                <p><strong>底部文本:</strong> {designConfig.footerText}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </ErrorBoundary>
  );
}