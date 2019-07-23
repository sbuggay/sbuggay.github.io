---
title: Temporal Batching
date: 2019-07-21 18:26:41
tags:
---

Steam has an API rate limit of 100,000 requests per 24 hours. I use the [GetPlayerSummaries](https://developer.valvesoftware.com/wiki/Steam_Web_API#GetPlayerSummaries_.28v0002.29) and [GetPlayerBans](https://developer.valvesoftware.com/wiki/Steam_Web_API#GetPlayerBans_.28v1.29) endpoints most predominantly for vaclist.net. What's nice about these endpoints is that they can take a list of steamids.



```javascript

type BatchedRequest<T> = (data: string[]) => Promise<T[]>;
interface IRequestStore<T> {
    promise: Promise<T>;
    resolve: Function;
}

export class BatchedRequester<T> {
    private _requests: { [index: string]: IRequestStore<T> };
    private _interval: NodeJS.Timeout;
    private _batchedRequest: BatchedRequest<T>;
    private _mapToRequest: (obj: T) => string;

    constructor(batchedRequest: (BatchedRequest<T>), mapToRequest: (obj: T) => string, interval: number) {
        this._batchedRequest = batchedRequest;
        this._mapToRequest = mapToRequest;
        this._interval = setInterval(this._flushRequests.bind(this), interval);
        this._requests = {};
    }

    /**
     * Queue up a request to be made, return the promise.
     *
     * @param {T} data
     * @returns {Promise<T>}
     * @memberof BatchedRequester
     */
    public request(data: string): Promise<T> {

        // If this has already been requested, return the previously generated promise
        if (this._requests[data]) {
            return this._requests[data].promise;
        }

        let retainedResolve = () => { };
        const promise = new Promise<T>((resolve) => {
            retainedResolve = resolve;
        });

        // Retain the request
        this._requests[data] = {
            promise,
            resolve: retainedResolve
        }

        // Return the internal promise
        return promise;
    }

    /**
     * Clear interval and request queue.
     *
     * @memberof BatchedRequester
     */
    public tearDown() {
        clearInterval(this._interval);
        this._requests = {};
    }

    /**
     * Flush request queue. Batch each and send to set request, resolve all batched promise resolves.
     *
     * @private
     * @memberof BatchedRequester
     */
    private async _flushRequests() {

        // If there are no requests, noop
        if (Object.keys(this._requests).length <= 0) return;

        // Run the provided request callback
        // Note: mapping is not done here
        const data = Object.keys(this._requests);
        const response = await this._batchedRequest(data);

        // For each response, 
        response.forEach((r) => {
            const key = this._mapToRequest(r);

            // There is a responded key that isn't in our requests, just drop it. 
            if (!this._requests[key]) {
                return;
            }
            
            this._requests[key].resolve(r);
            delete this._requests[key]; // Check perf?
        });

        // Return null to anything not found
        Object.keys(this._requests).forEach((key) => {
            this._requests[key].resolve(null);
        });

        this._requests = {};
    }
}
```