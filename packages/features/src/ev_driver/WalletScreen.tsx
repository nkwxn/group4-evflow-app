import { Modal, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useState } from 'react';
import { walletScreenStyles as styles } from '@evflow/ui';
import { SvgAssetIcon } from '../shared/SvgAssetIcon';
import { walletTransactions, type WalletTransaction } from './walletTransactions';

type WalletScreenProps = {
  bottomInset?: number;
  bottomOffset?: number;
  topInset?: number;
};

const totalBalance = 250000;
const historyPinOffset = 108;

export function WalletScreen({ bottomInset = 0, bottomOffset = 0, topInset = 0 }: WalletScreenProps) {
  const { height, width } = useWindowDimensions();
  const [selectedTransaction, setSelectedTransaction] = useState<WalletTransaction | null>(null);
  const [isHistoryPinned, setIsHistoryPinned] = useState(false);
  const desktop = width >= 768;

  return (
    <View style={styles.page}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: 28 + bottomOffset,
            paddingTop: 24 + topInset
          }
        ]}
        onScroll={(event) => {
          const shouldPinHistory = event.nativeEvent.contentOffset.y >= historyPinOffset;
          setIsHistoryPinned((current) => (current === shouldPinHistory ? current : shouldPinHistory));
        }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.balanceCard}>
          <View>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceValue}>{formatCurrency(totalBalance)}</Text>
          </View>
          <Pressable accessibilityRole="button" style={styles.topUpButton}>
            <Text style={styles.topUpButtonText}>Top Up</Text>
          </Pressable>
        </View>

        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Transaction History</Text>
          <View style={styles.filterButton}>
            <SvgAssetIcon color="#1f2529" height={12} name="sort" width={18} />
          </View>
        </View>

        <View style={styles.transactionList}>
          {walletTransactions.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              onPress={() => setSelectedTransaction(transaction)}
            />
          ))}
        </View>

        <View style={styles.cashbackBanner}>
          <Text style={styles.cashbackTitle}>Cashback !</Text>
          <Text style={styles.cashbackText}>Get 20% cashback from chosen SPKLU</Text>
          <View style={styles.cashbackCta}>
            <Text style={styles.cashbackCtaText}>CHECK NOW</Text>
          </View>
        </View>
      </ScrollView>

      {isHistoryPinned ? (
        <View pointerEvents="box-none" style={styles.pinnedHistoryShell}>
          <View style={[styles.pinnedHistoryInner, { paddingTop: topInset }]}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Transaction History</Text>
              <View style={styles.filterButton}>
                <SvgAssetIcon color="#1f2529" height={12} name="sort" width={18} />
              </View>
            </View>
          </View>
        </View>
      ) : null}

      <TransactionDetailModal
        bottomInset={bottomInset}
        desktop={desktop}
        screenHeight={height}
        topInset={topInset}
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </View>
  );
}

type TransactionRowProps = {
  transaction: WalletTransaction;
  onPress: () => void;
};

function TransactionRow({ transaction, onPress }: TransactionRowProps) {
  const success = transaction.status === 'success';

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.transactionCard}>
      <View style={[styles.transactionIcon, transaction.status === 'failed' && styles.failedTransactionIcon]}>
        <SvgAssetIcon
          color={transaction.status === 'failed' ? '#93000A' : '#53686A'}
          height={transaction.status === 'failed' ? 19 : 20}
          name={getTransactionIconName(transaction)}
          width={transaction.status === 'failed' ? 22 : 20}
        />
      </View>

      <View style={styles.transactionBody}>
        <Text style={styles.transactionTitle}>{transaction.title}</Text>
        <Text style={styles.transactionMeta}>
          {transaction.description}
          {transaction.connectorType ? ` • ${transaction.connectorType}` : ' • Ref ID: 82910'}
        </Text>
      </View>

      <View style={styles.transactionAmountWrap}>
        <Text style={[styles.transactionAmount, transaction.amount > 0 && styles.positiveAmount]}>
          {formatSignedCurrency(transaction.amount)}
        </Text>
        <View style={[styles.statusBadge, !success && styles.failedStatusBadge]}>
          <Text style={[styles.statusBadgeText, !success && styles.failedStatusBadgeText]}>
            {success ? 'SUCCESS' : 'FAILED'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

type TransactionDetailModalProps = {
  bottomInset: number;
  desktop: boolean;
  screenHeight: number;
  topInset: number;
  transaction: WalletTransaction | null;
  onClose: () => void;
};

function TransactionDetailModal({ bottomInset, desktop, screenHeight, topInset, transaction, onClose }: TransactionDetailModalProps) {
  const [detailsExpanded, setDetailsExpanded] = useState(true);

  if (!transaction) {
    return null;
  }

  const success = transaction.status === 'success';

  return (
    <Modal animationType={desktop ? 'fade' : 'slide'} transparent visible onRequestClose={onClose}>
      <View style={[styles.modalOverlay, desktop ? styles.centeredModalOverlay : styles.bottomModalOverlay]}>
        <View
          style={[
            styles.detailSheet,
            desktop ? [styles.desktopDetailSheet, { height: Math.floor(screenHeight * 0.8) }] : styles.mobileDetailSheet
          ]}
        >
          <View style={[styles.detailHeader, !desktop && { paddingTop: topInset }]}>
            <Pressable accessibilityLabel="Close transaction details" accessibilityRole="button" onPress={onClose} style={styles.closeButton}>
              <SvgAssetIcon color="#1f2529" height={14} name="close" width={14} />
            </Pressable>
            <Text style={styles.detailHeaderTitle}>Transaction Details</Text>
            <View style={styles.closeButton} />
          </View>

          <ScrollView contentContainerStyle={styles.detailContent} showsVerticalScrollIndicator={false}>
            <View style={[styles.detailResultIcon, !success && styles.failedDetailResultIcon]}>
              <Text style={[styles.detailResultIconText, !success && styles.failedDetailResultIconText]}>
                {success ? '✓' : '!'}
              </Text>
            </View>
            <Text style={styles.detailAmount}>{formatDetailAmount(transaction.amount)}</Text>
            <Text style={styles.detailType}>{transaction.type === 'topup' ? 'Top Up' : 'Charging'}</Text>

            <View style={styles.detailSummaryCard}>
              <View style={styles.detailSummaryIcon}>
                <SvgAssetIcon color="#53686A" height={20} name={transaction.type === 'topup' ? 'bankTopup' : 'chargingHistory'} width={20} />
              </View>
              <View>
                <Text style={styles.detailSummaryTitle}>
                  {transaction.type === 'topup' ? 'Wallet Topup' : 'Charging Payment'}
                </Text>
                <Text style={styles.detailSummaryMeta}>{transaction.referenceNo}</Text>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: detailsExpanded }}
              onPress={() => setDetailsExpanded((current) => !current)}
              style={styles.detailSectionHeader}
            >
              <Text style={styles.detailSectionTitle}>TRANSACTION DETAILS</Text>
              <Text style={styles.detailChevron}>{detailsExpanded ? '⌃' : '⌄'}</Text>
            </Pressable>

            {detailsExpanded ? (
              <>
                <DetailRow label="Status" value={success ? 'Success' : 'Failed'} valueStyle={success ? styles.successText : styles.failedText} />
                <DetailRow label="Added To" value={transaction.destination} valueStyle={styles.detailStrongValue} />
                <DetailRow label="Time" value={formatTime(transaction.occurredAt)} valueStyle={styles.detailStrongValue} />
                <DetailRow label="Date" value={formatDate(transaction.occurredAt)} valueStyle={styles.detailStrongValue} />
                <DetailRow label="Transaction ID" value={transaction.referenceNo} />
                <DetailRow label="Order ID" value={transaction.orderId} valueStyle={styles.detailStrongValue} />

                <View style={styles.detailDivider} />
                <DetailRow label="Amount" value={formatCurrency(Math.abs(transaction.amount))} valueStyle={styles.detailStrongValue} />
                <DetailRow label="Total" value={formatCurrency(Math.abs(transaction.amount))} valueStyle={styles.detailTotalValue} labelStyle={styles.detailTotalLabel} />
              </>
            ) : null}
          </ScrollView>

          <View style={[styles.invoiceFooter, { paddingBottom: 24 + bottomInset }]}>
            <Pressable accessibilityRole="button" style={styles.invoiceButton}>
              <Text style={styles.invoiceButtonText}>Download Invoice</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

type DetailRowProps = {
  label: string;
  value: string;
  labelStyle?: object;
  valueStyle?: object;
};

function DetailRow({ label, value, labelStyle, valueStyle }: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, labelStyle]}>{label}</Text>
      <Text style={[styles.detailValue, valueStyle]}>{value}</Text>
    </View>
  );
}

function formatCurrency(amount: number) {
  return `Rp ${Math.abs(amount).toLocaleString('id-ID')}`;
}

function getTransactionIconName(transaction: WalletTransaction) {
  if (transaction.status === 'failed') {
    return 'chargingFailure';
  }

  return transaction.type === 'topup' ? 'bankTopup' : 'chargingHistory';
}

function formatSignedCurrency(amount: number) {
  if (amount === 0) {
    return 'Rp 0';
  }

  return `${amount > 0 ? '+' : '-'}${formatCurrency(amount)}`;
}

function formatDetailAmount(amount: number) {
  return formatCurrency(Math.abs(amount));
}

function formatTime(isoDate: string) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta'
  }).format(new Date(isoDate));
}

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta'
  }).format(new Date(isoDate));
}
