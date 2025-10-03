'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Share2,
  Facebook,
  Twitter,
  Link2,
  Whatsapp,
  MessageCircle,
  Mail,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Product } from '@/lib/types/domain';

interface ProductShareProps {
  product: Product;
  className?: string;
}

export function ProductShare({ product, className = '' }: ProductShareProps) {
  const t = useTranslations('product');
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined'
    ? window.location.origin + `/p/${product.slug}`
    : '';

  const shareText = `Check out this ${product.title} from ${product.brand}!`;

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-blue-50 hover:text-blue-600'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      color: 'hover:bg-sky-50 hover:text-sky-600'
    },
    {
      name: 'WhatsApp',
      icon: Whatsapp,
      url: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
      color: 'hover:bg-green-50 hover:text-green-600'
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-gray-50 hover:text-gray-600'
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShare = async (platform: string) => {
    // Track share analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'share', {
        method: platform,
        content_type: 'product',
        item_id: product.id
      });
    }
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: shareText,
          url: shareUrl,
        });
        handleShare('native');
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <div className={className}>
      {/* Native Share Button (Mobile) */}
      {typeof navigator !== 'undefined' && navigator.share && (
        <Button
          variant="outline"
          size="sm"
          onClick={nativeShare}
          className="w-full sm:w-auto"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      )}

      {/* Dropdown Share Menu (Desktop) */}
      {!navigator.share && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={copyToClipboard}
              className="cursor-pointer"
            >
              <Link2 className="h-4 w-4 mr-2" />
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-600" />
                  Copied!
                </>
              ) : (
                'Copy Link'
              )}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {shareLinks.map((link) => (
              <DropdownMenuItem
                key={link.name}
                asChild
                className={`cursor-pointer ${link.color}`}
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleShare(link.name)}
                >
                  <link.icon className="h-4 w-4 mr-2" />
                  {link.name}
                </a>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Quick Share Buttons */}
      <div className="flex space-x-2 mt-3">
        {shareLinks.map((link) => (
          <Button
            key={link.name}
            variant="outline"
            size="icon"
            className={`h-8 w-8 ${link.color}`}
            asChild
          >
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleShare(link.name)}
              aria-label={`Share on ${link.name}`}
            >
              <link.icon className="h-4 w-4" />
            </a>
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 hover:bg-gray-50 hover:text-gray-600"
          onClick={copyToClipboard}
          aria-label="Copy link"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Link2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Share Success Message */}
      {copied && (
        <div className="mt-2 text-sm text-green-600 text-center">
          Link copied to clipboard!
        </div>
      )}
    </div>
  );
}

// Extended Share Component with More Options
export function ProductShareExtended({ product, className = '' }: ProductShareProps) {
  const t = useTranslations('product');
  const [showEmbedCode, setShowEmbedCode] = useState(false);

  const shareUrl = typeof window !== 'undefined'
    ? window.location.origin + `/p/${product.slug}`
    : '';

  const embedCode = `<iframe src="${shareUrl}/embed" width="300" height="400" frameborder="0"></iframe>`;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Basic Share */}
      <ProductShare product={product} />

      {/* Embed Option */}
      <div className="border-t pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowEmbedCode(!showEmbedCode)}
          className="text-sm"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Embed Product
        </Button>

        {showEmbedCode && (
          <div className="mt-3 p-3 bg-muted rounded-lg">
            <label className="text-sm font-medium mb-2 block">Embed Code:</label>
            <textarea
              value={embedCode}
              readOnly
              className="w-full p-2 text-xs border rounded bg-background"
              rows={3}
            />
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              onClick={() => {
                navigator.clipboard.writeText(embedCode);
              }}
            >
              Copy Embed Code
            </Button>
          </div>
        )}
      </div>

      {/* Product Link */}
      <div className="border-t pt-4">
        <label className="text-sm font-medium mb-2 block">Product Link:</label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 p-2 text-sm border rounded bg-muted"
          />
          <Button
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
            }}
          >
            Copy
          </Button>
        </div>
      </div>
    </div>
  );
}