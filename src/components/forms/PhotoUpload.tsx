import { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PhotoUploadProps {
  folder: string;
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
}

export function PhotoUpload({ folder, value, onChange, label = "Foto" }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    setLoading(true);
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 1400,
        useWebWorker: true,
        fileType: "image/webp",
      });
      const path = `${folder}/${crypto.randomUUID()}.webp`;
      const { error } = await supabase.storage.from("cards").upload(path, compressed, {
        contentType: "image/webp",
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("cards").getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (e) {
      console.error(e);
      toast.error("Não deu pra enviar a foto. Tenta de novo?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="label-text mb-2">{label}</p>
      <div className="flex items-center gap-3">
        <div className="h-20 w-20 rounded-md overflow-hidden bg-surface-elevated flex items-center justify-center shrink-0">
          {value ? <OptimizedImage src={value} alt="" className="h-full w-full" /> : <Camera className="h-6 w-6 text-muted-foreground/40" />}
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={() => inputRef.current?.click()} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : value ? "Trocar foto" : "Enviar foto"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
