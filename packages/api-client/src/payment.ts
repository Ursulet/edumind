export interface OrderDetails {
  id: string;
  totalAmount: number;
  currency: string;
  items: Array<{
    name: string;
    description?: string;
  }>;
}

export interface PaymentDetails {
  id: string;
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED';
  amount: number;
  currency: string;
  providerTxId?: string;
}

export interface PaymentProvider {
  createCheckout(order: OrderDetails): Promise<{ url: string; providerId: string }>;
  retrievePayment(providerId: string): Promise<PaymentDetails>;
  refund(providerId: string, amount?: number): Promise<{ success: boolean; refundId: string }>;
  verifyWebhook(payload: any, signature: string): boolean;
}

export class MockPaymentProvider implements PaymentProvider {
  async createCheckout(order: OrderDetails): Promise<{ url: string; providerId: string }> {
    const mockId = `mock_chk_${Date.now()}`;
    return {
      url: `/mock-checkout?session_id=${mockId}&order_id=${order.id}`,
      providerId: mockId,
    };
  }

  async retrievePayment(providerId: string): Promise<PaymentDetails> {
    return {
      id: providerId,
      status: 'SUCCEEDED',
      amount: 100, // mock amount
      currency: 'RON',
      providerTxId: `tx_${Date.now()}`,
    };
  }

  async refund(providerId: string, amount?: number): Promise<{ success: boolean; refundId: string }> {
    return {
      success: true,
      refundId: `ref_${Date.now()}`,
    };
  }

  verifyWebhook(payload: any, signature: string): boolean {
    // In a mock, we always consider it valid if signature matches a mock secret
    return signature === 'valid_mock_signature';
  }
}
