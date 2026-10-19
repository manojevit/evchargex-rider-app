import { Modal, Pressable, View } from 'react-native';
import { MotiView } from '@/lib/motion';
import { Txt } from '@/components/ui/Txt';
import { Button } from '@/components/ui/Button';

/** Centered confirmation dialog (used for destructive actions like sign-out). */
export function ConfirmDialog({
  visible,
  icon,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  icon?: React.ReactNode;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel} statusBarTranslucent>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, backgroundColor: 'rgba(8,13,20,0.55)' }}>
        <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={onCancel} />
        <MotiView
          from={{ opacity: 0, scale: 0.9, translateY: 8 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 16, stiffness: 230 }}
          style={{
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: 28,
            padding: 24,
            shadowColor: '#0B1420',
            shadowOpacity: 0.18,
            shadowRadius: 30,
            shadowOffset: { width: 0, height: 16 },
            elevation: 12,
          }}
        >
          {icon && <View className="mb-3 items-center">{icon}</View>}
          <Txt weight="black" className="text-center text-[19px] text-ink">
            {title}
          </Txt>
          <Txt weight="regular" className="mt-2 text-center text-[14px] leading-5 text-muted">
            {message}
          </Txt>
          <View className="mt-6 flex-row gap-3">
            <View className="flex-1">
              <Button label={cancelLabel} variant="secondary" onPress={onCancel} />
            </View>
            <View className="flex-1">
              <Button label={confirmLabel} variant={destructive ? 'danger' : 'primary'} onPress={onConfirm} />
            </View>
          </View>
        </MotiView>
      </View>
    </Modal>
  );
}
