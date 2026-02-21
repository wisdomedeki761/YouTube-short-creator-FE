'use client';

import { ApiKey } from '@/types/user';
import { cn } from '@/utils/helpers';
import { CheckCircle } from 'lucide-react';

interface AccountSelectorProps {
  platform: 'youtube' | 'facebook';
  accounts: ApiKey[];
  selectedAccounts: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function AccountSelector({
  platform,
  accounts,
  selectedAccounts,
  onSelectionChange,
}: AccountSelectorProps) {
  const platformAccounts = accounts.filter(a => a.platform === platform);

  if (platformAccounts.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic">
        No {platform} accounts configured. Add one in API Keys page.
      </div>
    );
  }

  const toggleAccount = (accountId: string) => {
    if (selectedAccounts.includes(accountId)) {
      onSelectionChange(selectedAccounts.filter(id => id !== accountId));
    } else {
      onSelectionChange([...selectedAccounts, accountId]);
    }
  };

  return (
    <div className="space-y-2">
      {platformAccounts.map((account) => {
        const isSelected = selectedAccounts.includes(account.id);
        const displayName = account.accountTag || account.channelTitle || `${platform} Account`;

        return (
          <button
            key={account.id}
            onClick={() => toggleAccount(account.id)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg border-2 p-3 transition-all text-left',
              isSelected
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <div className={cn(
              'flex h-5 w-5 items-center justify-center rounded border-2',
              isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
            )}>
              {isSelected && (
                <CheckCircle className="h-4 w-4 text-white" />
              )}
            </div>

            <div className="flex-1">
              <p className="font-medium text-gray-900">{displayName}</p>
              {account.channelTitle && account.accountTag !== account.channelTitle && (
                <p className="text-xs text-gray-500">{account.channelTitle}</p>
              )}
              <p className="text-xs text-gray-500">{account.usageCount || 0} uploads</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
