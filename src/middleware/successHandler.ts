import { Request, Response, NextFunction } from 'express';

const successHandler = (action: string) => (req: Request, res: Response, next: NextFunction) => {
    const successMessages: { [key: string]: string } = {
        upload: 'File uploaded successfully.',
        resize: 'File resized successfully.',
        crop: 'File cropped successfully.',
        download: 'File downloaded successfully.',
        filter: 'File filtered successfully.',
        watermark: 'File watermarked successfully.',
    };

    const message = successMessages[action] || 'Operation successful.';
    res.status(200).send(message);
};

export default successHandler;
