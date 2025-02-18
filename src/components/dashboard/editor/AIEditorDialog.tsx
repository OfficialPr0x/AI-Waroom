import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Wand2 } from "lucide-react";

function AIEditorDialog(props) {
  const {
    isOpen = false,
    onClose = () => {},
    selectedCode = "",
    onApplyChanges = () => {},
  } = props;
  const [prompt, setPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestion, setSuggestion] = useState("");

  const handleSubmit = () => {
    setIsProcessing(true);
    // TODO: Implement AI processing
    setTimeout(() => {
      setSuggestion("// AI suggested changes\n" + selectedCode);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] bg-gray-900 text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-500" />
            AI Code Assistant
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm">Your Prompt</label>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="What would you like to do with the selected code?"
              className="bg-gray-800 border-gray-700"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm mb-2 block">Selected Code</label>
              <div className="bg-gray-800 p-4 rounded-md">
                <pre className="text-sm">{selectedCode}</pre>
              </div>
            </div>
            <div>
              <label className="text-sm mb-2 block">AI Suggestion</label>
              <div className="bg-gray-800 p-4 rounded-md h-[200px] overflow-auto">
                <pre className="text-sm">{suggestion}</pre>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!prompt || isProcessing}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              {isProcessing ? "Processing..." : "Generate"}
            </Button>
            {suggestion && (
              <Button
                onClick={() => onApplyChanges(suggestion)}
                className="bg-green-600 hover:bg-green-700"
              >
                Apply Changes
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AIEditorDialog;
