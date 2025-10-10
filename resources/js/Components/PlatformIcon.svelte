<script>
  export let platform = '';
  const key = (platform || '').toLowerCase();

  let label = 'SOC';
  let bg = 'bg-gray-500';

  switch (key) {
    case 'instagram':
      label = 'IG';
      bg = 'bg-pink-600';
      break;
    case 'facebook':
      label = 'FB';
      bg = 'bg-blue-600';
      break;
    case 'twitter':
    case 'x':
      label = 'X';
      bg = 'bg-black';
      break;
    case 'threads':
      label = 'TH';
      bg = 'bg-black';
      break;
    case 'tiktok':
      label = 'TT';
      bg = 'bg-black';
      break;
    case 'youtube':
      label = 'YT';
      bg = 'bg-red-600';
      break;
    case 'linkedin':
      label = 'IN';
      bg = 'bg-blue-700';
      break;
  }
</script>

<span
  class={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold ${bg} text-white`}
  title={platform}
  aria-label={platform}
>
  {label}
</span>