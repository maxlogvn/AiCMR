'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useMergeTags } from '@/hooks/usePosts';
import { Loader2 } from 'lucide-react';

interface MergeDialogProps {
  open: boolean;
  onClose: () => void;
}

export function MergeDialog({ open, onClose }: MergeDialogProps) {
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const mergeTags = useMergeTags();

  const handleMerge = async () => {
    if (!sourceId || !targetId) {
      return;
    }

    await mergeTags.mutateAsync({
      source_id: parseInt(sourceId),
      target_id: parseInt(targetId),
    });
    onClose();
    setSourceId('');
    setTargetId('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Merge Tags</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Merge one tag into another. All posts using the source tag will be updated to use the target tag instead.
          </p>

          <div>
            <Label htmlFor="source-tag">Source Tag (to merge)</Label>
            <Input
              id="source-tag"
              type="number"
              placeholder="Enter source tag ID"
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="target-tag">Target Tag (merge into)</Label>
            <Input
              id="target-tag"
              type="number"
              placeholder="Enter target tag ID"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
            />
          </div>

          {sourceId && targetId && parseInt(sourceId) === parseInt(targetId) && (
            <p className="text-sm text-red-500">
              Source and target tags cannot be the same.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleMerge}
            disabled={mergeTags.isPending || !sourceId || !targetId}
          >
            {mergeTags.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Merge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
