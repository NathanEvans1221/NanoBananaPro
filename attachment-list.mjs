export const renderAttachmentList = (documentRef, container, attachments) => {
    const rows = attachments.map((file, index) => {
        const row = documentRef.createElement('div');
        row.className = 'flex items-center gap-2 mb-2 p-3 rounded-xl bg-white dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600';

        const icon = documentRef.createElement('span');
        icon.className = 'text-indigo-500';
        icon.textContent = '📎';

        const name = documentRef.createElement('span');
        name.className = 'truncate flex-1';
        name.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;

        const removeButton = documentRef.createElement('button');
        removeButton.type = 'button';
        removeButton.dataset.removeFile = String(index);
        removeButton.className = 'text-indigo-600 hover:underline dark:text-indigo-400';
        removeButton.textContent = '移除';

        row.append(icon, name, removeButton);
        return row;
    });

    container.replaceChildren(...rows);
};
